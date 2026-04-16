import { Audio } from 'expo-av';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, Animated, useColorScheme, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DraxProvider } from 'react-native-drax';

import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { useAuth } from '@/providers/auth-provider';

import {
  LANGUAGE_TOKENS,
  LANGUAGES,
  type LanguageInfo,
} from './coding-practice.constants';
import { type Exercise, type Language, type PlacedToken } from './coding-practice.types';
import { StudyFeedbackOverlay } from '../study-session/components/study-feedback-overlay';
import { StudyCompletionOverlay } from '../study-session/components/study-completion-overlay';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { QuizStatCard } from '@/components/quiz/stat-card';
import {
  AnswerArea,
  CategoryGridCard,
  DIFFICULTY_CONFIG,
  ExerciseListCard,
  LanguageSelector,
  QuestionCard,
  TokenKeyboard,
  ValidateButton,
} from './components/coding-practice-components';
import { CodingPracticeStore, type GlobalProgress } from './coding-practice.store';

// ─── helpers ─────────────────────────────────────────────
function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// Exercises will be loaded dynamically from CodingPracticeStore


function validate(placed: PlacedToken[], exercise: Exercise): boolean {
  const cleanPlaced = placed.filter((p) => p.tokenId !== 'sym_newline');
  const cleanSolution = exercise.solution.filter((s) => s !== 'sym_newline');
  if (cleanPlaced.length !== cleanSolution.length) return false;
  return cleanPlaced.every((p, i) => p.tokenId === cleanSolution[i]);
}

// ─── Main Screen ─────────────────────────────────────────
export function CodingPracticeScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const { lang: initialLangId } = useLocalSearchParams<{ lang: string }>();
  const [selectedLang, setSelectedLang] = useState<LanguageInfo>(() => {
    if (initialLangId) {
      const found = LANGUAGES.find(l => l.id === initialLangId);
      if (found) return found;
    }
    return LANGUAGES[0];
  });

  useEffect(() => {
    if (initialLangId) {
      const found = LANGUAGES.find(l => l.id === initialLangId);
      if (found) setSelectedLang(found);
    }
  }, [initialLangId]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [placed, setPlaced] = useState<PlacedToken[]>([]);
  const [pool, setPool] = useState<PlacedToken[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [userProgress, setUserProgress] = useState<GlobalProgress>({});
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [liveTimer, setLiveTimer] = useState(0);
  const [isHintsVisible, setIsHintsVisible] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  // Load exercises from db / cache
  React.useEffect(() => {
    CodingPracticeStore.getAllExercises().then((data) => {
      setAllExercises(data);
      setIsLoadingExercises(false);
    });
  }, []);

  // Load progress
  React.useEffect(() => {
    CodingPracticeStore.getProgress(user?.id).then(setUserProgress);
  }, [user?.id]);

  const refreshProgress = useCallback(async () => {
    const p = await CodingPracticeStore.getProgress(user?.id);
    setUserProgress(p);
  }, [user?.id]);

  // Live timer
  useEffect(() => {
    if (!startTime || finished) return;
    const interval = setInterval(() => {
      setLiveTimer(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, finished]);

  // Animated values for feedback
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;

  // Animated values for completion
  const completionBgOpacity = useRef(new Animated.Value(0)).current;
  const completionIconScale = useRef(new Animated.Value(0)).current;
  const completionTextOpacity = useRef(new Animated.Value(0)).current;
  const completionRingScale = useRef(new Animated.Value(0.8)).current;
  const completionRingOpacity = useRef(new Animated.Value(0)).current;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const initPool = useCallback((ex: Exercise) => {
    const newPool: PlacedToken[] = [];
    const tokensNeeded = ex.solution;
    const availableIds = ex.availableTokenIds;
    
    availableIds.forEach(id => {
      // Find how many times this token ID is needed in the solution
      const countInSolution = tokensNeeded.filter(sid => sid === id).length;
      // We provide at least 1 (if it's a distractor) or as many as needed
      const countToPool = Math.max(1, countInSolution);
      
      // Apply exercise-specific label if defined
      const customLabel = ex.tokenLabels?.[id];
      
      for (let i = 0; i < countToPool; i++) {
        newPool.push({ instanceId: uid(), tokenId: id, customLabel });
      }
    });
    
    // Shuffle to avoid giving away the solution order
    for (let i = newPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPool[i], newPool[j]] = [newPool[j], newPool[i]];
    }
    
    setPool(newPool);
  }, []);

  const playSound = useCallback(async (type: 'concluido' | 'erro') => {
    try {
      const source =
        type === 'concluido'
          ? require('../../../assets/songs/concluido.mp3')
          : require('../../../assets/songs/erro.mp3');
      const { sound } = await Audio.Sound.createAsync(source);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (err) {
      console.log('Error playing sound', err);
    }
  }, []);

  const exercisesForLang = useMemo(
    () => allExercises.filter((e) => e.language === (selectedLang.id as Language)),
    [allExercises, selectedLang.id],
  );

  const categories = useMemo(() => {
    return Array.from(new Set(exercisesForLang.map((e) => e.exerciseType)));
  }, [exercisesForLang]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    exercisesForLang.forEach(e => counts.set(e.exerciseType, (counts.get(e.exerciseType) || 0) + 1));
    return counts;
  }, [exercisesForLang]);

  const exercisesForCategory = useMemo(() => {
    return exercisesForLang.filter((e) => e.exerciseType === selectedCategory);
  }, [exercisesForLang, selectedCategory]);

  const availableDifficulties = useMemo(() => {
    return Array.from(new Set(exercisesForCategory.map((e) => e.difficulty)));
  }, [exercisesForCategory]);

  const exercises = useMemo(() => {
    if (!selectedDifficulty) return exercisesForCategory;
    return exercisesForCategory.filter((e) => e.difficulty === selectedDifficulty);
  }, [exercisesForCategory, selectedDifficulty]);

  const allLangTokens = LANGUAGE_TOKENS[selectedLang.id as Language];
  const availableTokens = useMemo(() => {
    if (!activeExercise) return allLangTokens;
    return allLangTokens.filter((t) => activeExercise.availableTokenIds.includes(t.id));
  }, [activeExercise, allLangTokens]);

  // ── actions ──────────────────────────────────────────────
  const handleSelectLang = useCallback((lang: LanguageInfo) => {
    setSelectedLang(lang);
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setActiveExercise(null);
    setPlaced([]);
    setIsCorrect(null);
    setHintIndex(0);
  }, []);

  const handleSelectExercise = useCallback((ex: Exercise) => {
    setActiveExercise(ex);
    setPlaced([]);
    initPool(ex);
    setIsCorrect(null);
    setHintIndex(0);
    setIsHintsVisible(false);
    setMoveCount(0);
    setStartTime(Date.now());
    setAttempts(0);
    setLiveTimer(0);
  }, [initPool]);
  const handleBack = useCallback(async () => {
    setActiveExercise(null);
    setPlaced([]);
    setPool([]);
    setIsCorrect(null);
    setHintIndex(0);
    setIsHintsVisible(false);
    setMoveCount(0);
    setStartTime(null);
    setFinished(false);
    await refreshProgress();
  }, [refreshProgress]);

  const handleRestartExercise = useCallback(async () => {
    setPlaced([]);
    if (activeExercise) initPool(activeExercise);
    setIsCorrect(null);
    setHintIndex(0);
    setIsHintsVisible(false);
    setMoveCount(0);
    setStartTime(Date.now());
    setFinished(false);
    setAttempts(0);
    setLiveTimer(0);
    await refreshProgress();
  }, [activeExercise, initPool, refreshProgress]);

  const handleAddToken = useCallback((instanceId: string) => {
    setPool((prevPool) => {
      const token = prevPool.find((p) => p.instanceId === instanceId);
      if (!token) return prevPool;
      setPlaced((prevPlaced) => [...prevPlaced, token]);
      setMoveCount((m) => m + 1);
      return prevPool.filter((p) => p.instanceId !== instanceId);
    });
    setIsCorrect(null);
  }, []);

  const handleReorder = useCallback((fromInstanceId: string, toIndex: number) => {
    setPlaced((prev) => {
      const fromIdx = prev.findIndex((p) => p.instanceId === fromInstanceId);
      if (fromIdx === -1 || fromIdx === toIndex) return prev;
      const item = prev[fromIdx];
      const without = [...prev.slice(0, fromIdx), ...prev.slice(fromIdx + 1)];
      const insertIdx = toIndex > fromIdx ? toIndex - 1 : toIndex;
      without.splice(Math.min(insertIdx, without.length), 0, item);
      setMoveCount((m) => m + 1);
      return without;
    });
    setIsCorrect(null);
  }, []);

  const handleInsertAt = useCallback((instanceId: string, atIndex: number) => {
    setPool((prevPool) => {
      const token = prevPool.find((p) => p.instanceId === instanceId);
      if (!token) return prevPool;
      setPlaced((prevPlaced) => {
        const copy = [...prevPlaced];
        copy.splice(atIndex, 0, token);
        return copy;
      });
      setMoveCount((m) => m + 1);
      return prevPool.filter((p) => p.instanceId !== instanceId);
    });
    setIsCorrect(null);
  }, []);

  const handleAddNewline = useCallback(() => {
    setPlaced((prev) => [...prev, { instanceId: uid(), tokenId: 'sym_newline' }]);
    setMoveCount((m) => m + 1);
    setIsCorrect(null);
  }, []);

  const handleRemove = useCallback((instanceId: string) => {
    setPlaced((prev) => {
      const token = prev.find((p) => p.instanceId === instanceId);
      if (!token) return prev;
      
      if (token.tokenId !== 'sym_newline') {
        setPool((prevPool) => [...prevPool, token]);
      }
      setMoveCount((m) => m + 1);
      return prev.filter((p) => p.instanceId !== instanceId);
    });
    setIsCorrect(null);
  }, []);

  const handleRename = useCallback((instanceId: string, newLabel: string) => {
    setPlaced((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, customLabel: newLabel } : p)),
    );
  }, []);

  const handleClear = useCallback(() => {
    setPool((prevPool) => {
      const toReturn = placed.filter((p) => p.tokenId !== 'sym_newline');
      return [...prevPool, ...toReturn];
    });
    setPlaced([]);
    setMoveCount((m) => m + 1);
    setIsCorrect(null);
  }, [placed]);

  const handleUndo = useCallback(() => {
    setPlaced((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.tokenId !== 'sym_newline') {
        setPool((prevPool) => [...prevPool, last]);
      }
      setMoveCount((m) => m + 1);
      return prev.slice(0, -1);
    });
    setIsCorrect(null);
  }, []);

  const handleNextExercise = useCallback(() => {
    if (!activeExercise) return;
    const currentCatExercises = allExercises.filter(
      (e) => e.language === activeExercise.language && e.exerciseType === activeExercise.exerciseType
    );
    const currentIdx = currentCatExercises.findIndex((e) => e.id === activeExercise.id);
    // Find next uncompleted, or just next in list
    const nextEx = currentCatExercises.find(
      (e, i) => i > currentIdx && !userProgress[e.id]?.completed
    ) || currentCatExercises[currentIdx + 1];
    if (nextEx) {
      setActiveExercise(nextEx);
      setPlaced([]);
      initPool(nextEx);
      setIsCorrect(null);
      setHintIndex(0);
      setIsHintsVisible(false);
      setMoveCount(0);
      setStartTime(Date.now());
      setFinished(false);
      setAttempts(0);
      setLiveTimer(0);
    } else {
      // No more exercises, go back to list
      handleBack();
    }
  }, [activeExercise, allExercises, userProgress, initPool, handleBack]);

  const handleValidate = useCallback(async () => {
    if (!activeExercise || placed.length === 0) return;
    setAttempts((a) => a + 1);
    const correct = validate(placed, activeExercise);

    if (correct) {
      setIsCorrect(true);
      const now = Date.now();
      const timeSecs = startTime ? Math.floor((now - startTime) / 1000) : 0;
      setElapsedTime(timeSecs);
      
      // Save global progress (sync to Firebase if logged in)
      await CodingPracticeStore.saveResult(activeExercise.id, timeSecs, moveCount, user?.id);
      
      await playSound('concluido');

      // Completion Effect (gold overlay with music sync)
      setShowCompletionEffect(true);
      completionBgOpacity.setValue(0);
      completionIconScale.setValue(0);
      completionTextOpacity.setValue(0);
      completionRingScale.setValue(0.8);
      completionRingOpacity.setValue(0.7);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(completionBgOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(completionIconScale, { toValue: 1.15, duration: 300, useNativeDriver: true }),
            Animated.timing(completionIconScale, { toValue: 0.92, duration: 120, useNativeDriver: true }),
            Animated.timing(completionIconScale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
          ]),
          Animated.timing(completionTextOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.parallel([
            Animated.timing(completionRingScale, { toValue: 2.4, duration: 1400, useNativeDriver: true }),
            Animated.timing(completionRingOpacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
          ]),
        ]),
        Animated.delay(800),
        Animated.timing(completionBgOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        setShowCompletionEffect(false);
        setFinished(true);
      });
    } else {
      setIsCorrect(false);
      await playSound('erro');

      setFeedbackType('wrong');
      iconScale.setValue(0);
      iconOpacity.setValue(1);

      Animated.sequence([
        Animated.spring(iconScale, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
        Animated.delay(600),
        Animated.timing(iconOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setIsCorrect(null);
      });
    }
  }, [
    activeExercise,
    placed,
    moveCount,
    startTime,
    user,
    playSound,
    iconScale,
    iconOpacity,
    completionBgOpacity,
    completionIconScale,
    completionTextOpacity,
    completionRingScale,
    completionRingOpacity,
  ]);

  const handleShowHint = useCallback(() => {
    const max = activeExercise?.hints?.length ?? 0;
    if (hintIndex < max) {
      setHintIndex((h) => h + 1);
    }
    setIsHintsVisible(true);
  }, [hintIndex, activeExercise]);

  // ─────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────

  const renderContent = () => {
    // 1. RESULTS VIEW
    if (finished && activeExercise) {
      const bg = isDark ? '#151718' : '#FFFFFF';
      const cardBg = isDark ? '#1C1F24' : '#F8FAFC';
      const cardBorder = isDark ? '#30363D' : '#E6E8EB';
      const textPrimary = isDark ? '#ECEDEE' : '#11181C';
      const textMuted = isDark ? '#9BA1A6' : '#687076';
      const accentColor = '#22C55E';

      const minElements = activeExercise.solution.filter(s => s !== 'sym_newline').length;
      let performanceRating: string = "Excelente";
      let ratingColor: string = QUIZ_COLORS.success;
      
      if (moveCount > minElements * 2) {
        performanceRating = "Tente Melhorar";
        ratingColor = QUIZ_COLORS.danger;
      } else if (moveCount > minElements) {
        performanceRating = "Bom";
        ratingColor = QUIZ_COLORS.warning;
      }

      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: bg }}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            paddingTop: topPadding + 12,
            paddingBottom: Math.max(insets.bottom, 20),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: '100%', maxWidth: 420 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: `${ratingColor}30`, backgroundColor: `${ratingColor}0D`, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <View style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: `${ratingColor}50`, backgroundColor: `${ratingColor}18`, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="emoji-events" size={38} color={ratingColor} />
                </View>
              </View>

              <Text style={{ fontSize: 32, fontWeight: '800', color: ratingColor, letterSpacing: -1, textAlign: 'center' }}>
                {performanceRating.toUpperCase()}!
              </Text>
              <Text style={{ fontSize: 14, color: textMuted, marginTop: 6 }}>Exercício concluído com sucesso</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <QuizStatCard 
                label="tempo" 
                value={`${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`} 
                icon="timer" 
                accentColor={QUIZ_COLORS.primary} 
                backgroundColor="rgba(63,81,181,0.09)" 
                borderColor="rgba(63,81,181,0.25)" 
                valueColor={QUIZ_COLORS.primary} 
                subtitleColor={textMuted} 
                style={{ flex: 1, padding: 12 }} 
                align="center" 
              />
              <QuizStatCard 
                label="movimentos" 
                value={`${moveCount}/${minElements}`} 
                subtitle={performanceRating}
                icon="touch-app" 
                accentColor={ratingColor} 
                backgroundColor={`${ratingColor}0D`} 
                borderColor={`${ratingColor}40`} 
                valueColor={ratingColor} 
                subtitleColor={ratingColor} 
                style={{ flex: 1, padding: 12 }} 
                align="center" 
              />
            </View>

            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(63,81,181,0.08)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: 'rgba(63,81,181,0.22)' }}>
                <MaterialIcons name="code" size={14} color="#3F51B5" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#3F51B5', letterSpacing: 0.2 }}>
                  {selectedLang.label} · {activeExercise.exerciseType}
                </Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={handleNextExercise}
                style={{ padding: 14, borderRadius: 14, backgroundColor: '#22C55E', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                activeOpacity={0.7}
              >
                <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }}>Próximo Exercício</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRestartExercise}
                style={{ padding: 14, borderRadius: 14, backgroundColor: '#3F51B5', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                activeOpacity={0.7}
              >
                <MaterialIcons name="replay" size={18} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }}>Praticar Novamente</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleBack}
                style={{ padding: 14, borderRadius: 14, backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                activeOpacity={0.7}
              >
                <MaterialIcons name="grid-view" size={18} color={textMuted} />
                <Text style={{ color: textMuted, fontWeight: 'bold', fontSize: 15 }}>Voltar aos Tópicos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    }

    // 2. ACTIVE EXERCISE VIEW
    if (activeExercise) {
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <DraxProvider>
            <View style={{ flex: 1 }}>
              {/* Scrollable area: pergunta + resposta */}
              <View style={{ flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingTop: topPadding + 8,
                    paddingBottom: 16,
                    flexGrow: 1,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ width: '100%', maxWidth: 768 }}>
                    {/* ① Pergunta */}
                    <QuestionCard
                      exercise={activeExercise}
                      language={selectedLang}
                      onBack={handleBack}
                      hintIndex={hintIndex}
                      onShowHint={handleShowHint}
                      isHintsVisible={isHintsVisible}
                      onToggleHints={setIsHintsVisible}
                      onHideHints={() => setIsHintsVisible(false)}
                      progressPercent={activeExercise.solution.length > 0
                        ? Math.round((placed.filter(p => p.tokenId !== 'sym_newline').length / activeExercise.solution.length) * 100)
                        : 0
                      }
                      liveTimer={liveTimer}
                    />

                    {/* ② Área de resposta */}
                    <AnswerArea
                      placed={placed}
                      allTokens={availableTokens}
                      onRemove={handleRemove}
                      onRename={handleRename}
                      onClear={handleClear}
                      onAddToken={handleAddToken}
                      onReorder={handleReorder}
                      onInsertAt={handleInsertAt}
                      isCorrect={isCorrect}
                      expectedCount={activeExercise.solution.length}
                      solution={activeExercise.solution}
                    />
                  </View>
                </ScrollView>
              </View>

              {/* ③④ Painel fixo na base: peças + botão verificar */}
              <View
                className="bg-white dark:bg-[#111316] border-t border-gray-200 dark:border-[#1E2328]"
                style={{
                  paddingBottom: Math.max(insets.bottom, 12),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -3 },
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  elevation: 12,
                  alignItems: 'center',
                }}
              >
                <View style={{ width: '100%', maxWidth: 768 }}>
                  <View>
                    {/* ③ Teclado de peças — fixo, sempre visível */}
                    <TokenKeyboard
                      pool={pool}
                      allTokens={availableTokens}
                      onAddToken={handleAddToken}
                    />

                    {/* ④ Botão verificar */}
                    <ValidateButton
                      onPress={handleValidate}
                      disabled={placed.filter(p => p.tokenId !== 'sym_newline').length < activeExercise.solution.length}
                      isCorrect={isCorrect}
                    />
                  </View>
                </View>
              </View>
            </View>
          </DraxProvider>
        </GestureHandlerRootView>
      );
    }

    // 3. SELECTION VIEW (LANGUAGES/CATEGORIES)
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding + 16 }}
        >
          {/* Header - Padrão Quiz/Categorias */}
          <View className="px-5 mb-4 mt-5 flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.push('/(features)/(main)/practice')} 
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? '#1C1F24' : '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}
            >
              <MaterialIcons name="arrow-back" size={20} color={isDark ? '#ECEDEE' : '#11181C'} />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">
                Prática de Código
              </Text>
              <Text className="mt-1 text-[#687076] dark:text-[#9BA1A6] text-sm">
                Monte a sintaxe como blocos de quebra-cabeça.
              </Text>
            </View>
          </View>

          {isLoadingExercises ? (
            <View style={{ paddingVertical: 48, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="#3F51B5" />
              <Text style={{ marginTop: 16, color: '#6B7280' }}>Carregando exercícios base...</Text>
            </View>
          ) : (
            <View style={{ width: '100%', maxWidth: 880, alignSelf: 'center' }}>
            {/* Language selector */}
          <LanguageSelector
            languages={LANGUAGES}
            selected={selectedLang}
            onSelect={handleSelectLang}
          />

          {/* Main content area */}
          {!selectedCategory ? (
            /* CATEGORY GRID */
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: isDark ? '#30363D' : '#E2E8F0' }} />
                <Text style={{ color: isDark ? '#9BA1A6' : '#64748B', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' }}>
                  Tópicos de Estudo • {selectedLang.label}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: isDark ? '#30363D' : '#E2E8F0' }} />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {categories.map((cat) => {
                  return (
                    <CategoryGridCard
                      key={cat}
                      categoryName={cat}
                      count={categoryCounts.get(cat) || 0}
                      onPress={() => setSelectedCategory(cat)}
                    />
                  );
                })}
                {categories.length === 0 && (
                  <View style={{ width: '100%', alignItems: 'center', paddingVertical: 48 }}>
                    <MaterialIcons name="code-off" size={40} color="#1E2328" />
                    <Text style={{ color: '#374151', fontSize: 13, marginTop: 12 }}>Nenhum tópico disponível para esta linguagem.</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            /* EXERCISES LIST */
            <View>
              {/* Sub header for category */}
              <View style={{ paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory(null);
                    setSelectedDifficulty(null);
                  }}
                  hitSlop={12}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#1E2328',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons name="arrow-back" size={16} color="#ECEDEE" />
                </TouchableOpacity>
                <Text style={{ color: '#ECEDEE', fontSize: 16, fontWeight: '700' }}>{selectedCategory}</Text>
                <Text style={{ color: '#4B5563', fontSize: 13, marginLeft: 'auto' }}>
                  {exercisesForCategory.length} ex{exercisesForCategory.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {/* Difficulty filter chips */}
              {availableDifficulties.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setSelectedDifficulty(null)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: selectedDifficulty === null ? '#ECEDEE' : '#1A1D21',
                        borderWidth: 1,
                        borderColor: selectedDifficulty === null ? '#ECEDEE' : '#2D3139',
                      }}
                    >
                      <Text style={{ color: selectedDifficulty === null ? '#111316' : '#9BA1A6', fontSize: 12, fontWeight: '700' }}>
                        Todos
                      </Text>
                    </TouchableOpacity>

                    {availableDifficulties.map((diff) => {
                      const isSelected = selectedDifficulty === diff;
                      const conf = DIFFICULTY_CONFIG[diff as keyof typeof DIFFICULTY_CONFIG];
                      return (
                        <TouchableOpacity
                          key={diff}
                          activeOpacity={0.7}
                          onPress={() => setSelectedDifficulty(diff)}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 20,
                            backgroundColor: isSelected ? conf.color : '#1A1D21',
                            borderWidth: 1,
                            borderColor: isSelected ? conf.color : '#2D3139',
                          }}
                        >
                          <Text style={{ color: isSelected ? '#111316' : conf.color, fontSize: 12, fontWeight: '700', textTransform: 'capitalize' }}>
                            {conf.label || diff}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Exercise cards */}
              <View style={{ paddingHorizontal: 16 }}>
                {exercises.length === 0 ? (
                  <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                    <MaterialIcons name="inbox" size={40} color="#1E2328" />
                    <Text style={{ color: '#374151', fontSize: 13, marginTop: 12 }}>Nenhum exercício disponível nesta aba.</Text>
                  </View>
                ) : (
                  exercises.map((ex) => (
                    <ExerciseListCard
                      key={ex.id}
                      exercise={ex}
                      language={selectedLang}
                      progress={userProgress[ex.id]}
                      onPress={() => handleSelectExercise(ex)}
                    />
                  ))
                )}
              </View>
            </View>
          )}
        </View>
        )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#151718' : '#FFFFFF' }}>
      {renderContent()}

      {/* Overlays always rendered at top level */}
      <StudyFeedbackOverlay feedbackType={feedbackType} iconOpacity={iconOpacity} iconScale={iconScale} />
      <StudyCompletionOverlay
        visible={showCompletionEffect}
        correctCount={1}
        totalCards={1}
        title="Exercício concluído!"
        subtitle="Solução correta"
        backgroundOpacity={completionBgOpacity}
        iconScale={completionIconScale}
        textOpacity={completionTextOpacity}
        ringScale={completionRingScale}
        ringOpacity={completionRingOpacity}
      />
    </View>
  );
}
