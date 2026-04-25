import { GlossaryText } from '@/components/glossary-text';
import { PanelCard } from '@/components/quiz/panel-card';
import { ConfirmExitModal } from '@/components/ui/confirm-exit-modal';
import { ValidationFab } from '@/components/ui/validation-fab';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { fetchQuickResponseProgress, saveQuickResponseResult } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  BackHandler
} from 'react-native';

import {
  QuickResponseCategory,
  QuickResponseContext,
  QuickResponseData,
  QuickResponseExercise
} from './quick-response.types';

const { width } = Dimensions.get('window');

// Fallback usado enquanto o catálogo do Firestore ainda não chegou.
const EMPTY_QUICK_RESPONSE_DATA: QuickResponseData = {
  game: '',
  version: '0',
  categories: [],
} as unknown as QuickResponseData;

// ── SLA helpers ────────────────────────────────────────────────────────────
// Tempo em segundos (comprimido para o jogo), proporcional ao SLA real por
// prioridade e área (Suporte < NOC/SOC para incidentes críticos).
const SLA_DURATION_MAP: Record<string, Record<string, number>> = {
  Baixa:   { suporte_tecnico: 60, noc: 55, soc: 55 },
  Urgente: { suporte_tecnico: 45, noc: 40, soc: 40 },
  Crítica: { suporte_tecnico: 35, noc: 25, soc: 25 },
};

const PRIORITY_COLORS: Record<'P1' | 'P2' | 'P3', string> = {
  P1: '#EF4444',
  P2: '#F59E0B',
  P3: '#22C55E',
};

const PRIORITY_BG_DARK: Record<'P1' | 'P2' | 'P3', string> = {
  P1: '#2D161B',
  P2: '#2D1F0A',
  P3: '#0F2318',
};

const PRIORITY_BG_LIGHT: Record<'P1' | 'P2' | 'P3', string> = {
  P1: '#FFF1F2',
  P2: '#FFFBEB',
  P3: '#F0FDF4',
};

function getSLADuration(level: string, categoryId?: string): number {
  return (SLA_DURATION_MAP[level] ?? SLA_DURATION_MAP.Baixa)[categoryId ?? 'suporte_tecnico'] ?? 45;
}

function getPriorityLabel(level: string): 'P1' | 'P2' | 'P3' {
  if (level === 'Crítica') return 'P1';
  if (level === 'Urgente') return 'P2';
  return 'P3';
}

function getRealWorldSLA(level: string, categoryId?: string): string {
  const isNocSoc = categoryId === 'noc' || categoryId === 'soc';
  if (level === 'Crítica') return isNocSoc ? '15min' : '1h';
  if (level === 'Urgente') return isNocSoc ? '1h' : '4h';
  return isNocSoc ? '4h' : '8h';
}

export function QuickResponseScreen() {
  const isDark = useColorScheme() === 'dark';
  const topPadding = useTopContentPadding();
  const bottomPadding = useTabContentPadding();
  const { user } = useAuth();
  const { refreshUserProgress, quickResponseCatalog, loadQuickResponseCatalog } = useData();

  useEffect(() => {
    loadQuickResponseCatalog();
  }, [loadQuickResponseCatalog]);

  // Catálogo vem do Firestore via DataProvider (preload).
  const data = (quickResponseCatalog as QuickResponseData | null) ?? EMPTY_QUICK_RESPONSE_DATA;

  const [selectedCategory, setSelectedCategory] = useState<QuickResponseCategory | null>(null);
  const [activeExercise, setActiveExercise] = useState<QuickResponseExercise | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; stats?: { attempts: number; timeBonus: number; withinSLA: boolean } } | null>(null);
  const [answeredStats, setAnsweredStats] = useState<Record<string, { attempts: number; withinSLA: boolean }>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [maxTime, setMaxTime] = useState(60);
  const [isValidated, setIsValidated] = useState(false);
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccessTransition, setShowSuccessTransition] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<'TODOS' | 'BAIXA' | 'URGENTE' | 'CRÍTICA'>('TODOS');
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);
  const [showContextCard, setShowContextCard] = useState(false);
  const navigation = useNavigation();
  const [pendingAction, setPendingAction] = useState<any>(null);
  const isExitingRef = useRef(false);
  const isSmallScreen = width < 768;

  // Intercept Hardware/Browser Back
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      // If we are NOT in an active exercise, or it's finished, let it go
      if (!activeExercise || feedback?.isCorrect || isExitingRef.current) return;

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Show confirmation
      setPendingAction(e.data.action);
      setConfirmExitOpen(true);
    });

    return unsub;
  }, [navigation, activeExercise, feedback?.isCorrect]);

  // BackHandler for Android
  useEffect(() => {
    const onBackPress = () => {
      if (activeExercise && !feedback?.isCorrect && !isExitingRef.current) {
        setConfirmExitOpen(true);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [activeExercise, feedback?.isCorrect]);
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const playSound = async (type: 'success' | 'complete' | 'error') => {
    try {
      const soundFile = type === 'complete' ? require('@/assets/songs/concluido.mp3') : 
                        type === 'success' ? require('@/assets/songs/acertou.mp3') : 
                        require('@/assets/songs/errou.mp3');
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Erro ao tocar som:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchQuickResponseProgress(user.id).then(setAnsweredStats);
    }
  }, [user]);

  // getSLADuration, getPriorityLabel e getRealWorldSLA definidos fora do componente

  useEffect(() => {
    let timer: any;
    // Don't start timer if we are syncing, showing feedback, or in transition
    if (activeExercise && !feedback && !isSyncing && !showSuccessTransition && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && !feedback && !isSyncing && !showSuccessTransition && activeExercise && !isValidated) {
      // Only trigger SLA violation if we haven't validated yet and feedback is null
      setFeedback({
        isCorrect: false,
        message: "SLA REJEITADO: Resposta fora do tempo limite."
      });
      playSound('error');
    }
    return () => clearInterval(timer);
  }, [activeExercise, feedback, timeLeft, isSyncing, showSuccessTransition, isValidated]);

  const bg = isDark ? '#0D0F10' : '#F8FAFC';
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';
  const textMuted = isDark ? '#9BA1A6' : '#687076';
  const surfaceColor = isDark ? '#1A1D21' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const handleSelectExercise = (ex: QuickResponseExercise) => {
    // Reset numeric/boolean states FIRST to prevent timer race conditions
    const duration = getSLADuration(ex.level, selectedCategory?.id);
    setTimeLeft(duration);
    setMaxTime(duration);
    setIsValidated(false);
    setCurrentAttempts(0);
    setSelectedIds(new Set());
    setShowContextCard(false); // fecha a ficha ao iniciar novo exercício
    
    // Set active exercise and clear feedback LAST
    setActiveExercise(ex);
    setFeedback(null);
  };

  const handleToggleOption = (optionId: string) => {
    if (isValidated) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(optionId)) next.delete(optionId);
      else next.add(optionId);
      return next;
    });
  };

  const handleValidate = () => {
    if (!activeExercise || isValidated || isSyncing) return;
    const correctIds = activeExercise.actions.filter(a => a.is_correct).map(a => a.id);
    const selectedList = Array.from(selectedIds);
    const isExactlyCorrect = selectedList.length === correctIds.length && correctIds.every(id => selectedIds.has(id));
    
    const newAttempts = currentAttempts + 1;
    setCurrentAttempts(newAttempts);

    if (isExactlyCorrect) {
      setIsSyncing(true);
      playSound('complete');
      setIsValidated(true);
      setShowSuccessTransition(true);

      // Reset and Start Animation
      successScale.setValue(0);
      successOpacity.setValue(1);
      
      Animated.timing(successScale, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessTransition(false);
          setFeedback({
            isCorrect: true,
            message: activeExercise.success_message,
            stats: { attempts: newAttempts, timeBonus: timeLeft, withinSLA: timeLeft > 0 }
          });
          setIsSyncing(false);
        });
      }, 3000);

      setAnsweredStats(prev => ({
        ...prev,
        [activeExercise.id]: { attempts: newAttempts, withinSLA: timeLeft > 0 }
      }));
      if (user) {
        saveQuickResponseResult(user.id, activeExercise.id, newAttempts, timeLeft > 0)
          .then(() => refreshUserProgress())
          .catch(err => console.error("Erro ao salvar progresso:", err));
      }
    } else {
      setIsValidated(true);
      playSound('error');
      const wrongSelected = activeExercise.actions.find(a => selectedIds.has(a.id) && !a.is_correct);
      const missingCorrect = activeExercise.actions.find(a => a.is_correct && !selectedIds.has(a.id));
      let msg = "A solução proposta está incompleta ou contém erros técnicos.";
      if (wrongSelected?.feedback) msg = wrongSelected.feedback;
      else if (missingCorrect) msg = "Você esqueceu de uma ação crítica para a resolução.";
      setFeedback({ isCorrect: false, message: msg });
    }
  };

  const handleRetry = () => {
    setFeedback(null);
    setIsValidated(false);
    setSelectedIds(new Set());
    if (activeExercise) {
      const duration = getSLADuration(activeExercise.level, selectedCategory?.id);
      setTimeLeft(duration);
      setMaxTime(duration);
    }
  };

  const handleNext = () => {
    if (!selectedCategory || !activeExercise) return;
    const currentIndex = selectedCategory.exercises.findIndex(e => e.id === activeExercise.id);
    if (currentIndex < selectedCategory.exercises.length - 1) {
      handleSelectExercise(selectedCategory.exercises[currentIndex + 1]);
    } else {
      setActiveExercise(null);
      setFeedback(null);
    }
  };

  // Fully cancel the in-progress incident exercise: wipe selections, timer,
  // validation flags and any transient overlays so the user lands back on a
  // clean category view.
  const handleConfirmExit = () => {
    setConfirmExitOpen(false);
    isExitingRef.current = true;
    if (pendingAction) {
      navigation.dispatch(pendingAction);
    } else {
      setActiveExercise(null);
      setFeedback(null);
      setSelectedIds(new Set());
      setIsValidated(false);
      setCurrentAttempts(0);
      setIsSyncing(false);
      setShowSuccessTransition(false);
    }
  };

  const handleCancelExit = () => {
    setConfirmExitOpen(false);
    setPendingAction(null);
  };

  const renderCategoryList = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: bottomPadding + 40 }}>
      {/* Header - Full Width */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 16 }}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: surfaceColor, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: borderColor }}
          >
            <MaterialIcons name="arrow-back" size={20} color={textPrimary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: '900', color: textPrimary, letterSpacing: -0.5 }}>{data.game}</Text>
        </View>
        <Text style={{ fontSize: 15, color: textMuted, lineHeight: 22 }}>
          Encare incidentes reais de TI e prove que você é um especialista em suporte e infraestrutura.
        </Text>
      </View>

      {/* Content - Constrained Width */}
      <View style={[styles.maxContentWidth, { paddingHorizontal: 20 }]}>
        <View style={{ gap: 16 }}>
          {data.categories.map((cat) => {
            const completedCount = cat.exercises.filter(ex => answeredStats[ex.id]).length;
            const progress = completedCount / cat.exercises.length;
            return (
              <TouchableOpacity key={cat.id} activeOpacity={0.8} onPress={() => setSelectedCategory(cat)}>
                <PanelCard style={{ backgroundColor: surfaceColor, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: cat.color + '20' }}>
                  <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                    <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: cat.color + '15', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: cat.color + '30' }}>
                      <MaterialCommunityIcons name={cat.id === 'suporte_tecnico' ? 'account-wrench' : cat.id === 'noc' ? 'lan' : 'shield-alert'} size={28} color={cat.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: textPrimary }}>{cat.name}</Text>
                      <Text style={{ fontSize: 13, color: textMuted, marginTop: 2 }} numberOfLines={2}>{cat.description}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
                        <View style={{ flex: 1, height: 4, backgroundColor: isDark ? '#2D3139' : '#E2E8F0', borderRadius: 2 }}>
                          <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: cat.color, borderRadius: 2 }} />
                        </View>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted }}>{completedCount}/{cat.exercises.length}</Text>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={textMuted} />
                  </View>
                </PanelCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );

  const renderExerciseList = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: bottomPadding + 40 }}>
      {/* Header - Full Width */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 16 }}>
          <TouchableOpacity 
            onPress={() => setSelectedCategory(null)} 
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: surfaceColor, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: borderColor }}
          >
            <MaterialIcons name="arrow-back" size={20} color={textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: selectedCategory?.color, textTransform: 'uppercase', letterSpacing: 1 }}>{selectedCategory?.name}</Text>
            <Text style={{ fontSize: 24, fontWeight: '900', color: textPrimary, letterSpacing: -0.5 }}>Selecione um Incidente</Text>
          </View>
        </View>
      </View>

      {/* Content - Constrained Width */}
      <View style={[styles.maxContentWidth, { paddingHorizontal: 20 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ gap: 8 }}>
          {['TODOS', 'BAIXA', 'URGENTE', 'CRÍTICA'].map((filter) => {
            const isActive = priorityFilter === filter;
            const filterColor = filter === 'BAIXA' ? '#22C55E' : filter === 'URGENTE' ? '#F59E0B' : filter === 'CRÍTICA' ? '#EF4444' : selectedCategory?.color;
            return (
              <TouchableOpacity 
                key={filter} 
                onPress={() => setPriorityFilter(filter as any)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: isActive ? filterColor : surfaceColor,
                  borderWidth: 1.5,
                  borderColor: isActive ? filterColor : borderColor,
                }}
              >
                <Text style={{ color: isActive ? '#FFFFFF' : textMuted, fontWeight: '800', fontSize: 12 }}>{filter}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ gap: 12 }}>
          {selectedCategory?.exercises
            .filter(ex => priorityFilter === 'TODOS' || ex.level.toUpperCase() === priorityFilter)
            .sort((a, b) => {
              const weights: Record<string, number> = { 'Baixa': 1, 'Urgente': 2, 'Crítica': 3 };
              return (weights[a.level] || 0) - (weights[b.level] || 0);
            })
            .map((ex, index) => {
            const stats = answeredStats[ex.id];
            const isAnswered = !!stats;
            return (
              <TouchableOpacity key={ex.id} activeOpacity={0.8} onPress={() => handleSelectExercise(ex)}>
                <PanelCard style={{ backgroundColor: isAnswered ? (isDark ? '#141818' : '#F0FDF4') : surfaceColor, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: isAnswered ? 'rgba(34,197,94,0.2)' : borderColor }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: isAnswered ? 'rgba(34,197,94,0.15)' : (isDark ? '#2D3139' : '#F1F5F9'), alignItems: 'center', justifyContent: 'center' }}>
                      {isAnswered ? <MaterialIcons name="check" size={20} color="#22C55E" /> : <Text style={{ fontWeight: '800', color: textMuted }}>{index + 1}</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: textPrimary }} numberOfLines={1}>{ex.alert}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: ex.level === 'Baixa' ? '#22C55E20' : ex.level === 'Urgente' ? '#F59E0B20' : '#EF444420' }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: ex.level === 'Baixa' ? '#22C55E' : ex.level === 'Urgente' ? '#F59E0B' : '#EF4444' }}>{ex.level.toUpperCase()}</Text>
                        </View>
                        {isAnswered && (
                          <>
                            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: textMuted + '40' }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <MaterialIcons name="timer" size={12} color={stats.withinSLA ? '#22C55E' : '#EF4444'} />
                              <Text style={{ fontSize: 11, fontWeight: '700', color: stats.withinSLA ? '#22C55E' : '#EF4444' }}>{stats.withinSLA ? 'SLA OK' : 'SLA OUT'}</Text>
                            </View>
                            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: textMuted + '40' }} />
                            <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted }}>{stats.attempts} {stats.attempts === 1 ? 'TENTATIVA' : 'TENTATIVAS'}</Text>
                          </>
                        )}
                      </View>
                    </View>
                    <MaterialIcons name="play-arrow" size={20} color={textMuted} />
                  </View>
                </PanelCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );

  const renderActiveExercise = () => {
    if (!activeExercise) return null;
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Active Exercise Header - Full Width Background, Constrained Content */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: surfaceColor }}>
          <View style={[styles.maxContentWidth, { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <TouchableOpacity onPress={() => setConfirmExitOpen(true)} style={{ padding: 8, marginLeft: -8 }}>
                <MaterialIcons name="close" size={24} color={textPrimary} />
              </TouchableOpacity>
              {/* SLA dinâmico: badge de prioridade + timer + referência real */}
              {(() => {
                const pLabel = getPriorityLabel(activeExercise.level);
                const pColor = PRIORITY_COLORS[pLabel];
                const timerColor = timeLeft < maxTime * 0.25 ? '#EF4444' : timeLeft < maxTime * 0.5 ? '#F59E0B' : '#9BA1A6';
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {/* Badge P1/P2/P3 */}
                    <View style={{ paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8, backgroundColor: pColor + '20', borderWidth: 1, borderColor: pColor + '50' }}>
                      <Text style={{ color: pColor, fontWeight: '900', fontSize: 12, letterSpacing: 0.5 }}>{pLabel}</Text>
                    </View>
                    {/* Timer */}
                    <MaterialCommunityIcons name="timer-outline" size={16} color={timerColor} />
                    <Text style={{ fontWeight: '800', color: textPrimary, fontSize: 13 }}>{timeLeft}s</Text>
                    {/* Barra de progresso */}
                    <View style={{ width: 52, height: 5, backgroundColor: isDark ? '#2D3139' : '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ width: `${(timeLeft / maxTime) * 100}%`, height: '100%', backgroundColor: timeLeft < maxTime * 0.25 ? '#EF4444' : timeLeft < maxTime * 0.5 ? '#F59E0B' : '#22C55E', borderRadius: 3 }} />
                    </View>
                    {/* Referência real */}
                    <Text style={{ fontSize: 10, color: textMuted, fontWeight: '600' }}>real: {getRealWorldSLA(activeExercise.level, selectedCategory?.id)}</Text>
                  </View>
                );
              })()}
            </View>
            {/* Card de alerta com cor dinâmica por prioridade */}
            {(() => {
              const pLabel = getPriorityLabel(activeExercise.level);
              const pColor = PRIORITY_COLORS[pLabel];
              const cardBg = isDark ? PRIORITY_BG_DARK[pLabel] : PRIORITY_BG_LIGHT[pLabel];
              const pTitle = pLabel === 'P1' ? 'INCIDENTE P1 — CRÍTICO' : pLabel === 'P2' ? 'INCIDENTE P2 — URGENTE' : 'INCIDENTE P3 — BAIXA';
              const pSubtitle = `SLA de atendimento: ${getRealWorldSLA(activeExercise.level, selectedCategory?.id)}`;
              return (
                <View style={{ backgroundColor: cardBg, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: pColor + '30' }}>
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: pColor, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name="notifications-active" size={22} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: pColor, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 2 }}>{pTitle}</Text>
                      <Text style={{ color: pColor + 'CC', fontSize: 13, fontWeight: '700' }}>{pSubtitle}</Text>
                    </View>
                  </View>
                  <GlossaryText
                    text={`"${activeExercise.alert}"`}
                    track="Incidentes"
                    style={{ fontSize: 16, color: isDark ? '#ECEDEE' : '#11181C', lineHeight: 24, fontWeight: '600' }}
                  />
                </View>
              );
            })()}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingVertical: 20, paddingBottom: bottomPadding + 100 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.maxContentWidth, { paddingHorizontal: 20 }]}>

            {/* Ficha do Chamado — card expansível (só exibido se há context) */}
            {activeExercise.context && (
              <View style={{ marginBottom: 16, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowContextCard(v => !v)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: isDark ? '#1A1D21' : '#F1F5F9',
                    paddingHorizontal: 16, paddingVertical: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialCommunityIcons name="file-document-outline" size={16} color="#38BDF8" />
                    <Text style={{ color: '#38BDF8', fontWeight: '800', fontSize: 12, letterSpacing: 0.5 }}>FICHA DO CHAMADO</Text>
                    {activeExercise.context.ticket_id && (
                      <Text style={{ color: textMuted, fontSize: 11, fontWeight: '600' }}>{activeExercise.context.ticket_id}</Text>
                    )}
                  </View>
                  <MaterialIcons name={showContextCard ? 'expand-less' : 'expand-more'} size={20} color={textMuted} />
                </TouchableOpacity>

                {showContextCard && (
                  <View style={{ backgroundColor: isDark ? '#141618' : '#FFFFFF', padding: 16, gap: 10 }}>
                    {activeExercise.context.system && (
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                        <MaterialCommunityIcons name="monitor" size={14} color={textMuted} style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, textTransform: 'uppercase', marginBottom: 2 }}>Sistema</Text>
                          <Text style={{ fontSize: 13, color: textPrimary, fontWeight: '500' }}>{activeExercise.context.system}</Text>
                        </View>
                      </View>
                    )}
                    {activeExercise.context.affected_users && (
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                        <MaterialCommunityIcons name="account-group" size={14} color={textMuted} style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, textTransform: 'uppercase', marginBottom: 2 }}>Usuários impactados</Text>
                          <Text style={{ fontSize: 13, color: textPrimary, fontWeight: '500' }}>{activeExercise.context.affected_users}</Text>
                        </View>
                      </View>
                    )}
                    {activeExercise.context.opened_by && (
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                        <MaterialCommunityIcons name="account" size={14} color={textMuted} style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, textTransform: 'uppercase', marginBottom: 2 }}>Aberto por</Text>
                          <Text style={{ fontSize: 13, color: textPrimary, fontWeight: '500' }}>{activeExercise.context.opened_by}</Text>
                        </View>
                      </View>
                    )}
                    {activeExercise.context.topology_hint && (
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                        <MaterialCommunityIcons name="lan" size={14} color={textMuted} style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, textTransform: 'uppercase', marginBottom: 2 }}>Ambiente / Topologia</Text>
                          <Text style={{ fontSize: 13, color: textPrimary, fontWeight: '500', lineHeight: 19 }}>{activeExercise.context.topology_hint}</Text>
                        </View>
                      </View>
                    )}
                    {activeExercise.context.log_snippet && (
                      <View style={{ marginTop: 4 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, textTransform: 'uppercase', marginBottom: 6 }}>Log / Trecho</Text>
                        <View style={{ backgroundColor: isDark ? '#0D0F10' : '#F8FAFC', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' }}>
                          <Text style={{ fontFamily: 'monospace', fontSize: 11, color: '#22C55E', lineHeight: 17 }}>{activeExercise.context.log_snippet}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Como você deseja proceder?</Text>
                <Text style={{ fontSize: 13, color: '#38BDF8', fontWeight: '700', marginTop: 2 }}>ESTE INCIDENTE REQUER {activeExercise.actions.filter(a => a.is_correct).length} AÇÕES CORRETAS</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '800', color: selectedIds.size === activeExercise.actions.filter(a => a.is_correct).length ? '#22C55E' : textMuted }}>
                {selectedIds.size}/{activeExercise.actions.filter(a => a.is_correct).length}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {activeExercise.actions.map((option) => {
                const isSelected = selectedIds.has(option.id);
                const showResult = isValidated;
                const isCorrect = option.is_correct;
                return (
                  <TouchableOpacity 
                    key={option.id} 
                    activeOpacity={0.7} 
                    onPress={() => handleToggleOption(option.id)} 
                    disabled={isValidated} 
                    style={{ 
                      backgroundColor: showResult && isSelected ? (isCorrect ? '#22C55E15' : '#EF444415') : (isSelected ? (isDark ? '#00d4ff15' : '#E0F7FF') : (isDark ? '#1A1D21' : '#FFFFFF')), 
                      borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 2, 
                      borderColor: showResult && isSelected ? (isCorrect ? '#22C55E' : '#EF4444') : (isSelected ? '#00d4ff' : borderColor), 
                      alignSelf: 'flex-start' 
                    }}
                  >
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: showResult && isSelected ? (isCorrect ? '#22C55E' : '#EF4444') : (isSelected ? '#00d4ff' : (isDark ? '#2D3139' : '#F1F5F9')), alignItems: 'center', justifyContent: 'center' }}>
                        {showResult && isSelected && isCorrect ? <MaterialIcons name="check" size={12} color="#FFFFFF" /> : <Text style={{ fontWeight: '800', color: isSelected ? '#FFFFFF' : textMuted, fontSize: 10 }}>{option.id.toUpperCase()}</Text>}
                      </View>
                      <Text style={{ fontSize: 13, color: textPrimary, fontWeight: '600' }}>{option.text}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

          </View>
        </ScrollView>

        {!isValidated && (
          <ValidationFab
            onPress={handleValidate}
            disabled={selectedIds.size === 0 || isSyncing}
            icon="check"
            bottomInset={16}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: topPadding }}>
      {!selectedCategory ? renderCategoryList() : (!activeExercise ? renderExerciseList() : renderActiveExercise())}
      
      <Modal visible={!!feedback} transparent animationType="fade" onRequestClose={() => setFeedback(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.88)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <ScrollView style={{ width: '100%', maxWidth: 520 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <PanelCard style={{ backgroundColor: surfaceColor, borderRadius: 28, padding: 24, borderWidth: 1, borderColor: feedback?.isCorrect ? '#22C55E40' : '#EF444440', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 30, elevation: 24 }}>

              {/* Header */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: feedback?.isCorrect ? '#22C55E' : '#EF4444', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: feedback?.isCorrect ? '#22C55E' : '#EF4444', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12 }}>
                  <MaterialIcons name={feedback?.isCorrect ? 'verified' : 'report-problem'} size={40} color="#FFFFFF" />
                </View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: textPrimary, textAlign: 'center' }}>{feedback?.isCorrect ? 'Incidente Resolvido!' : 'Falha na Resolução'}</Text>
                <Text style={{ fontSize: 11, color: textMuted, marginTop: 3, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Relatório Pós-Incidente</Text>
              </View>

              <View style={{ gap: 12, marginBottom: 20 }}>

                {/* Stats */}
                {feedback?.stats && (
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1, backgroundColor: isDark ? 'rgba(34,197,94,0.08)' : '#F0FDF4', padding: 10, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#22C55E25' }}>
                      <MaterialIcons name="timer" size={16} color={feedback.stats.withinSLA ? '#22C55E' : '#EF4444'} />
                      <Text style={{ fontSize: 9, fontWeight: '700', color: textMuted, marginTop: 3 }}>SLA</Text>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: feedback.stats.withinSLA ? '#22C55E' : '#EF4444' }}>{feedback.stats.withinSLA ? 'OK' : 'OUT'}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: isDark ? 'rgba(56,189,248,0.08)' : '#F0F9FF', padding: 10, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#38BDF825' }}>
                      <MaterialIcons name="refresh" size={16} color="#38BDF8" />
                      <Text style={{ fontSize: 9, fontWeight: '700', color: textMuted, marginTop: 3 }}>TENTATIVAS</Text>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: '#38BDF8' }}>{feedback.stats.attempts}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: isDark ? 'rgba(168,85,247,0.08)' : '#FAF5FF', padding: 10, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#A855F725' }}>
                      <MaterialIcons name="check-circle-outline" size={16} color="#A855F7" />
                      <Text style={{ fontSize: 9, fontWeight: '700', color: textMuted, marginTop: 3 }}>AÇÕES</Text>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: '#A855F7' }}>{activeExercise?.actions.filter(a => a.is_correct).length}</Text>
                    </View>
                  </View>
                )}

                {/* Feedback técnico */}
                <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: borderColor }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Feedback Técnico</Text>
                  <Text style={{ fontSize: 14, lineHeight: 21, color: textPrimary, fontWeight: '500' }}>{feedback?.message}</Text>
                </View>

                {/* Gabarito — todas as ações com ✅/❌ */}
                {activeExercise && (
                  <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: borderColor }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, marginBottom: 10, textTransform: 'uppercase' }}>Gabarito das Ações</Text>
                    <View style={{ gap: 8 }}>
                      {activeExercise.actions.map((action) => (
                        <View key={action.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: action.is_correct ? '#22C55E20' : '#EF444420', alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 }}>
                            <MaterialIcons name={action.is_correct ? 'check' : 'close'} size={12} color={action.is_correct ? '#22C55E' : '#EF4444'} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 13, color: action.is_correct ? textPrimary : textMuted, fontWeight: action.is_correct ? '600' : '400', lineHeight: 18 }}>{action.text}</Text>
                            {!action.is_correct && action.feedback && (
                              <Text style={{ fontSize: 11, color: '#EF4444', marginTop: 2, lineHeight: 16 }}>{action.feedback}</Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Explicação técnica aprofundada */}
                {activeExercise?.explanation && (
                  <View style={{ backgroundColor: isDark ? 'rgba(56,189,248,0.05)' : '#F0F9FF', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#38BDF820' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <MaterialCommunityIcons name="lightbulb-outline" size={14} color="#38BDF8" />
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#38BDF8', textTransform: 'uppercase' }}>Contexto Técnico</Text>
                    </View>
                    <Text style={{ fontSize: 13, lineHeight: 20, color: textPrimary, fontWeight: '400' }}>{activeExercise.explanation}</Text>
                  </View>
                )}

                {/* Runbook passo a passo */}
                {activeExercise?.runbook_steps && activeExercise.runbook_steps.length > 0 && (
                  <View style={{ backgroundColor: isDark ? 'rgba(168,85,247,0.05)' : '#FAF5FF', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#A855F720' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <MaterialCommunityIcons name="format-list-numbered" size={14} color="#A855F7" />
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#A855F7', textTransform: 'uppercase' }}>Runbook de Resolução</Text>
                    </View>
                    <View style={{ gap: 8 }}>
                      {activeExercise.runbook_steps.map((step, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#A855F720', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                            <Text style={{ fontSize: 10, fontWeight: '900', color: '#A855F7' }}>{idx + 1}</Text>
                          </View>
                          <Text style={{ flex: 1, fontSize: 13, color: textPrimary, lineHeight: 19, fontWeight: '400' }}>{step}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

              </View>

              {/* Botões */}
              <View style={{ gap: 10 }}>
                {feedback?.isCorrect ? (
                  <TouchableOpacity onPress={handleNext} style={{ backgroundColor: '#22C55E', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#22C55E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 15 }}>PRÓXIMO INCIDENTE →</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={handleRetry} style={{ flex: 1, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: borderColor }}>
                      <Text style={{ color: textPrimary, fontWeight: '800', fontSize: 14 }}>TENTAR NOVAMENTE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext} style={{ flex: 1, backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}>
                      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>PULAR →</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

            </PanelCard>
          </ScrollView>
        </View>
      </Modal>

      {showSuccessTransition && (
        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(13, 15, 16, 0.9)',
          zIndex: 9999,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: successOpacity
        }}>
          <Animated.View style={{
            transform: [{ scale: successScale }],
            alignItems: 'center'
          }}>
            <View style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: '#22C55E',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#22C55E',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 40,
              elevation: 20
            }}>
              <MaterialIcons name="check" size={100} color="#FFFFFF" />
            </View>
            <Text style={{ 
              color: '#22C55E', 
              fontSize: 24, 
              fontWeight: '900', 
              marginTop: 32,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}>
              Incidente Resolvido
            </Text>
          </Animated.View>
        </Animated.View>
      )}

      {/* Confirm exit — only reachable from the active-exercise close (X);
          category/exercise list back buttons bypass this. */}
      <ConfirmExitModal
        visible={confirmExitOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
        title="Abandonar incidente?"
        message="Seu progresso neste incidente será descartado. Deseja realmente sair?"
        confirmLabel="Abandonar"
        cancelLabel="Continuar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  maxContentWidth: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
});
