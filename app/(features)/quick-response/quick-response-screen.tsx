import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  useColorScheme, 
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
  Modal
} from 'react-native';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { PanelCard } from '@/components/quiz/panel-card';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';
import { fetchQuickResponseProgress, saveQuickResponseResult } from '@/lib/api';

import SupportData from '../coding-practice/Data/suportetecnico.json';
import { 
  QuickResponseData, 
  QuickResponseCategory, 
  QuickResponseExercise,
  QuickResponseOption
} from './quick-response.types';

const { width } = Dimensions.get('window');
const data = SupportData as unknown as QuickResponseData;

export function QuickResponseScreen() {
  const isDark = useColorScheme() === 'dark';
  const topPadding = useTopContentPadding();
  const bottomPadding = useTabContentPadding();
  const { user } = useAuth();
  const { refreshUserProgress } = useData();

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

  const getSLADuration = (_level: string) => 40;

  useEffect(() => {
    let timer: NodeJS.Timeout;
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
    const duration = getSLADuration(ex.level);
    setTimeLeft(duration); 
    setMaxTime(duration);
    setIsValidated(false);
    setCurrentAttempts(0);
    setSelectedIds(new Set());
    
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
      const duration = getSLADuration(activeExercise.level);
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

  const renderCategoryList = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: topPadding + 20, paddingBottom: bottomPadding + 40, paddingHorizontal: 20 }}>
      <View style={{ marginBottom: 32 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: surfaceColor, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: borderColor }}>
          <MaterialIcons name="arrow-back" size={20} color={textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 28, fontWeight: '800', color: textPrimary, letterSpacing: -0.5 }}>{data.game}</Text>
        <Text style={{ fontSize: 15, color: textMuted, marginTop: 4, lineHeight: 22 }}>Encare incidentes reais de TI e prove que você é um especialista em suporte e infraestrutura.</Text>
      </View>
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
    </ScrollView>
  );

  const renderExerciseList = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: topPadding + 20, paddingBottom: bottomPadding + 40, paddingHorizontal: 20 }}>
      <View style={{ marginBottom: 24 }}>
        <TouchableOpacity onPress={() => setSelectedCategory(null)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: surfaceColor, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: borderColor }}>
          <MaterialIcons name="arrow-back" size={20} color={textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 12, fontWeight: '800', color: selectedCategory?.color, textTransform: 'uppercase', letterSpacing: 1 }}>{selectedCategory?.name}</Text>
        <Text style={{ fontSize: 24, fontWeight: '800', color: textPrimary, marginTop: 4, letterSpacing: -0.5 }}>Selecione um Incidente</Text>
      </View>

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
    </ScrollView>
  );

  const renderActiveExercise = () => {
    if (!activeExercise) return null;
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ paddingTop: topPadding + 10, paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: surfaceColor }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => { setActiveExercise(null); setFeedback(null); }} style={{ padding: 8, marginLeft: -8 }}>
              <MaterialIcons name="close" size={24} color={textPrimary} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="fire-extinguisher" size={18} color="#F43F5E" />
              <Text style={{ fontWeight: '800', color: textPrimary, fontSize: 14 }}>SLA: {timeLeft}s</Text>
            </View>
            <View style={{ width: 40, height: 6, backgroundColor: isDark ? '#2D3139' : '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ width: `${(timeLeft / maxTime) * 100}%`, height: '100%', backgroundColor: timeLeft < (maxTime * 0.25) ? '#F43F5E' : (timeLeft < (maxTime * 0.5) ? '#F59E0B' : '#22C55E') }} />
            </View>
          </View>
          <View style={{ backgroundColor: isDark ? '#2D161B' : '#FFF1F2', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F43F5E30' }}>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F43F5E', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="notifications-active" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F43F5E', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 2 }}>ALERTA DE SISTEMA</Text>
                <Text style={{ color: isDark ? '#FFD1D9' : '#9F1239', fontSize: 14, fontWeight: '700' }}>Ação imediata requerida</Text>
              </View>
            </View>
            <Text style={{ fontSize: 16, color: isDark ? '#ECEDEE' : '#11181C', lineHeight: 24, fontWeight: '600' }}>"{activeExercise.alert}"</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: bottomPadding + 100 }} showsVerticalScrollIndicator={false}>
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

          {!isValidated && (
            <TouchableOpacity onPress={handleValidate} disabled={selectedIds.size === 0 || isSyncing} style={{ backgroundColor: selectedIds.size > 0 ? '#22C55E' : textMuted, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 24, opacity: selectedIds.size > 0 ? 1 : 0.5 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>{isSyncing ? 'SINCRONIZANDO...' : 'VALIDAR'}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {!selectedCategory ? renderCategoryList() : (!activeExercise ? renderExerciseList() : renderActiveExercise())}
      
      <Modal visible={!!feedback} transparent animationType="fade" onRequestClose={() => setFeedback(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <PanelCard style={{ width: '100%', maxWidth: 500, alignSelf: 'center', backgroundColor: surfaceColor, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: feedback?.isCorrect ? '#22C55E40' : '#EF444440', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 30, elevation: 24 }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: feedback?.isCorrect ? '#22C55E' : '#EF4444', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: feedback?.isCorrect ? '#22C55E' : '#EF4444', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 15 }}>
                <MaterialIcons name={feedback?.isCorrect ? "verified" : "report-problem"} size={44} color="#FFFFFF" />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: textPrimary, textAlign: 'center' }}>{feedback?.isCorrect ? 'Incidente Resolvido!' : 'Falha na Resolução'}</Text>
              <Text style={{ fontSize: 13, color: textMuted, marginTop: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>Relatório de Troubleshooting</Text>
            </View>

            <View style={{ gap: 16, marginBottom: 32 }}>
              <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: borderColor }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8, textTransform: 'uppercase' }}>Feedback Técnico</Text>
                <Text style={{ fontSize: 15, lineHeight: 22, color: textPrimary, fontWeight: '500' }}>{feedback?.message}</Text>
              </View>
              {feedback?.isCorrect && feedback.stats && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1, backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : '#F0FDF4', padding: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#22C55E30' }}>
                    <MaterialIcons name="timer" size={18} color={feedback.stats.withinSLA ? '#22C55E' : '#EF4444'} />
                    <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, marginTop: 4 }}>SLA</Text>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: feedback.stats.withinSLA ? '#22C55E' : '#EF4444' }}>{feedback.stats.withinSLA ? 'OK' : 'OUT'}</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: isDark ? 'rgba(56,189,248,0.1)' : '#F0F9FF', padding: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#38BDF830' }}>
                    <MaterialIcons name="refresh" size={18} color="#38BDF8" />
                    <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, marginTop: 4 }}>TENTATIVAS</Text>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#38BDF8' }}>{feedback.stats.attempts}</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: isDark ? 'rgba(168,85,247,0.1)' : '#FAF5FF', padding: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#A855F730' }}>
                    <MaterialIcons name="check_circle_outline" size={18} color="#A855F7" />
                    <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, marginTop: 4 }}>AÇÕES</Text>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#A855F7' }}>{activeExercise?.actions.filter(a => a.is_correct).length}</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={{ gap: 12 }}>
              {feedback?.isCorrect ? (
                <TouchableOpacity onPress={handleNext} style={{ backgroundColor: '#22C55E', paddingVertical: 18, borderRadius: 18, alignItems: 'center', shadowColor: '#22C55E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>PRÓXIMO INCIDENTE</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity onPress={handleRetry} style={{ flex: 1, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: borderColor }}>
                    <Text style={{ color: textPrimary, fontWeight: '800', fontSize: 15 }}>REVISAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNext} style={{ flex: 1, backgroundColor: '#EF4444', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 15 }}>PULAR</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </PanelCard>
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
    </View>
  );
}

const styles = StyleSheet.create({});
