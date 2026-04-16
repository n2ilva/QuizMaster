import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';

import { AnswerOption } from '@/components/quiz/answer-option';
import { GlossaryText } from '@/components/glossary-text';
import { QuizActionButton } from '@/components/quiz/action-button';
import { QuizStatCard } from '@/components/quiz/stat-card';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { getNextPlanStep, parseStudyIndex, parseStudySequence } from '@/lib/study-flow';
import {
  clearInProgressLesson,
  fetchCards,
  fetchInProgressLesson,
  fetchMasterTestCards,
  resolveTrackLabel,
  saveCardResult,
  saveLesson,
  updateUserProfile,
  upsertInProgressLesson,
  type Flashcard,
  type UserLevel,
} from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

import { StudyCompletionOverlay } from './components/study-completion-overlay';
import { StudyFeedbackOverlay } from './components/study-feedback-overlay';
import { OPTION_LETTERS } from './study-session.constants';

type AnswerState = {
  selectedIndex: number | null;
  revealed: boolean;
};

export function StudySessionScreen() {
  const { track, category, mode, sequence, index, source } = useLocalSearchParams<{
    track: string;
    category: string;
    mode?: string;
    sequence?: string | string[];
    index?: string | string[];
    source?: string;
  }>();
  const isMasterTest = mode === 'master-test';
  const router = useRouter();
  const { user } = useAuth();
  const { refreshUserProgress } = useData();

  const decodedCategory = useMemo(() => decodeURIComponent(category ?? ''), [category]);
  const decodedTrack = useMemo(() => decodeURIComponent(track ?? ''), [track]);
  const planSequence = useMemo(() => parseStudySequence(sequence), [sequence]);
  const planIndex = useMemo(() => parseStudyIndex(index), [index]);
  const isPlanFlow = source === 'plan' && planSequence.length > 0;
  const nextPlanStep = useMemo(() => getNextPlanStep(decodedTrack, planSequence, planIndex), [decodedTrack, planIndex, planSequence]);
  const contextLabel = useMemo(
    () =>
      isMasterTest
        ? `🏆 TESTE MASTER · ${resolveTrackLabel(decodedTrack)}`.toLocaleUpperCase('pt-BR')
        : `${decodedTrack} · ${decodedCategory}`.toLocaleUpperCase('pt-BR'),
    [decodedTrack, decodedCategory, isMasterTest],
  );

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [activeDifficulty, setActiveDifficulty] = useState<UserLevel>('Fácil');
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<AnswerState>({ selectedIndex: null, revealed: false });
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionElapsedSeconds, setQuestionElapsedSeconds] = useState(0);

  const startTimeRef = useRef(Date.now());
  const questionStartTimeRef = useRef(Date.now());
  const scrollViewRef = useRef<ScrollView>(null);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const correctSoundRef = useRef<Audio.Sound | null>(null);
  const wrongSoundRef = useRef<Audio.Sound | null>(null);
  const completionSoundRef = useRef<Audio.Sound | null>(null);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const completionBgOpacity = useRef(new Animated.Value(0)).current;
  const completionIconScale = useRef(new Animated.Value(0)).current;
  const completionTextOpacity = useRef(new Animated.Value(0)).current;
  const completionRingScale = useRef(new Animated.Value(0.8)).current;
  const completionRingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        staysActiveInBackground: false,
      });

      await Asset.loadAsync([
        require('@/assets/songs/acertou.mp3'),
        require('@/assets/songs/errou.mp3'),
        require('@/assets/songs/concluido.mp3'),
      ]);

      const [{ sound: correctSound }, { sound: wrongSound }, { sound: completionSound }] = await Promise.all([
        Audio.Sound.createAsync(require('@/assets/songs/acertou.mp3'), { shouldPlay: false }),
        Audio.Sound.createAsync(require('@/assets/songs/errou.mp3'), { shouldPlay: false }),
        Audio.Sound.createAsync(require('@/assets/songs/concluido.mp3'), { shouldPlay: false }),
      ]);

      await Promise.all([
        correctSound.setStatusAsync({ shouldPlay: true, positionMillis: 0, volume: 0 }).then(() =>
          correctSound.setStatusAsync({ shouldPlay: false, positionMillis: 0, volume: 1 }),
        ),
        wrongSound.setStatusAsync({ shouldPlay: true, positionMillis: 0, volume: 0 }).then(() =>
          wrongSound.setStatusAsync({ shouldPlay: false, positionMillis: 0, volume: 1 }),
        ),
        completionSound.setStatusAsync({ shouldPlay: true, positionMillis: 0, volume: 0 }).then(() =>
          completionSound.setStatusAsync({ shouldPlay: false, positionMillis: 0, volume: 1 }),
        ),
      ]);

      correctSoundRef.current = correctSound;
      wrongSoundRef.current = wrongSound;
      completionSoundRef.current = completionSound;
    })();

    return () => {
      correctSoundRef.current?.unloadAsync();
      wrongSoundRef.current?.unloadAsync();
      completionSoundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (answer.revealed) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [answer.revealed]);

  const layoutMode = useLayoutMode();
  const isDesktopLayout = layoutMode === 'desktop';
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPadding = useTopContentPadding();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        if (cancelled) return;
        if (isMasterTest) {
          const masterTestCards = await fetchMasterTestCards(decodedTrack);
          if (!cancelled) setCards(masterTestCards);
          return;
        }

        const studyDeck = await fetchCards(decodedTrack, decodedCategory, user?.id);
        if (!cancelled) {
          setCards(studyDeck.cards);
          setActiveDifficulty(studyDeck.activeDifficulty);

          if (user && studyDeck.cards.length > 0) {
            const inProgress = await fetchInProgressLesson(user.id, decodedTrack, decodedCategory, studyDeck.activeDifficulty);
            if (!cancelled && inProgress && inProgress.answeredCount > 0) {
              const resumedIndex = Math.min(inProgress.answeredCount, Math.max(0, studyDeck.cards.length - 1));
              setCurrentIndex(resumedIndex);
              setCorrectCount(Math.max(0, inProgress.correctCount));
              startTimeRef.current = Date.now() - Math.max(0, inProgress.elapsedMs);
            }
          }
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [decodedTrack, decodedCategory, user, isMasterTest]);

  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setQuestionElapsedSeconds(0);
  }, [currentIndex]);

  useEffect(() => {
    if (answer.revealed) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
      setQuestionElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, answer.revealed]);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex] as Flashcard | undefined;
  const progressPercent = totalCards > 0 ? ((currentIndex + (answer.revealed ? 1 : 0)) / totalCards) * 100 : 0;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answer.revealed || !currentCard) return;
      const isCorrect = optionIndex === currentCard.correctIndex;
      const soundRef = isCorrect ? correctSoundRef.current : wrongSoundRef.current;
      void soundRef?.setStatusAsync({ shouldPlay: true, positionMillis: 0 });

      const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
      if (isCorrect) setCorrectCount((count) => count + 1);
      setAnswer({ selectedIndex: optionIndex, revealed: true });

      setFeedbackType(isCorrect ? 'correct' : 'wrong');
      iconScale.setValue(0);
      iconOpacity.setValue(1);
      Animated.sequence([
        Animated.spring(iconScale, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
        Animated.delay(500),
        Animated.timing(iconOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();

      if (user && currentCard.id) {
        void saveCardResult(user.id, currentCard.id, isCorrect);
      }

      if (user && !isMasterTest) {
        void upsertInProgressLesson(user.id, {
          track: decodedTrack,
          category: decodedCategory,
          difficulty: activeDifficulty,
          answeredCount: currentIndex + 1,
          correctCount: newCorrectCount,
          totalCount: totalCards,
          elapsedMs: Date.now() - startTimeRef.current,
        });
      }
    },
    [answer.revealed, currentCard, correctCount, user, isMasterTest, decodedTrack, decodedCategory, activeDifficulty, currentIndex, totalCards, iconScale, iconOpacity],
  );

  const handleNext = useCallback(async () => {
    if (currentIndex + 1 < totalCards) {
      setCurrentIndex((index) => index + 1);
      setAnswer({ selectedIndex: null, revealed: false });
      return;
    }

    setShowCompletionEffect(true);
    try {
      const sound = completionSoundRef.current;
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch {
      // ignore
    }

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
      Animated.delay(1080),
      Animated.timing(completionBgOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      setShowCompletionEffect(false);
      setFinished(true);
    });

    if (user) {
      try {
        setSaving(true);
        const lessonCategory = isMasterTest ? 'Teste Master' : decodedCategory;
        await saveLesson(user.id, {
          category: lessonCategory,
          track: decodedTrack,
          difficulty: isMasterTest ? undefined : activeDifficulty,
          correctCount,
          totalCount: totalCards,
          durationMs: Date.now() - startTimeRef.current,
        });
        if (!isMasterTest) {
          await clearInProgressLesson(user.id, { track: decodedTrack, category: decodedCategory, difficulty: activeDifficulty });
        }
        if (user.name) {
          await updateUserProfile(user.id, user.name);
        }
        await refreshUserProgress();
      } catch (error) {
        console.error('Erro ao salvar lição:', error);
      } finally {
        setSaving(false);
      }
    }
  }, [currentIndex, totalCards, user, isMasterTest, decodedCategory, decodedTrack, activeDifficulty, correctCount, refreshUserProgress, completionBgOpacity, completionIconScale, completionTextOpacity, completionRingScale, completionRingOpacity]);

  const accuracyPercent = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;
  const getOptionStatus = useCallback(
    (optionIndex: number) => {
      if (!answer.revealed || !currentCard) return 'idle' as const;
      if (optionIndex === currentCard.correctIndex) return 'correct' as const;
      if (optionIndex === answer.selectedIndex) return 'incorrect' as const;
      return 'dimmed' as const;
    },
    [answer, currentCard],
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718]">
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text className="mt-3 text-[#687076] dark:text-[#9BA1A6]">Carregando quizzes...</Text>
      </View>
    );
  }

  if (totalCards === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5 dark:bg-[#151718]">
        <View>
          <Text className="text-lg font-bold text-[#11181C] dark:text-[#ECEDEE]">Nenhum quiz disponível</Text>
          <Text className="mt-2 text-center text-[#687076] dark:text-[#9BA1A6]">Esta categoria ainda não possui quizzes cadastrados.</Text>
          <QuizActionButton label="Voltar" icon="arrow-back" onPress={() => router.back()} variant="primary-solid" style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  if (finished) {
    const wrongCount = totalCards - correctCount;
    const accentColor = accuracyPercent >= 70 ? '#22C55E' : accuracyPercent >= 40 ? '#F59E0B' : '#EF4444';
    const performanceLabel = accuracyPercent >= 90 ? 'Excelente!' : accuracyPercent >= 70 ? 'Bom trabalho!' : accuracyPercent >= 40 ? 'Continue praticando!' : 'Não desista!';
    const performanceIcon: React.ComponentProps<typeof MaterialIcons>['name'] = accuracyPercent >= 90 ? 'emoji-events' : accuracyPercent >= 70 ? 'star' : accuracyPercent >= 40 ? 'trending-up' : 'refresh';

    const bg = isDark ? '#151718' : '#FFFFFF';
    const cardBg = isDark ? '#1C1F24' : '#F8FAFC';
    const cardBorder = isDark ? '#30363D' : '#E6E8EB';
    const textPrimary = isDark ? '#ECEDEE' : '#11181C';
    const textMuted = isDark ? '#9BA1A6' : '#687076';

    return (
      <View style={{ flex: 1, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {saving ? (
          <ActivityIndicator size="large" color="#3F51B5" />
        ) : (
          <View style={{ width: '100%', maxWidth: 420 }}>
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <View style={{ width: 148, height: 148, borderRadius: 74, borderWidth: 2, borderColor: `${accentColor}30`, backgroundColor: `${accentColor}0D`, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <View style={{ width: 108, height: 108, borderRadius: 54, borderWidth: 2, borderColor: `${accentColor}50`, backgroundColor: `${accentColor}18`, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name={performanceIcon} size={58} color={accentColor} />
                </View>
              </View>

              <Text style={{ fontSize: 76, fontWeight: '800', color: accentColor, letterSpacing: -3, lineHeight: 80 }}>{accuracyPercent}%</Text>
              <Text style={{ fontSize: 15, color: textMuted, marginTop: 4 }}>de acertos</Text>
              <Text style={{ fontSize: 19, fontWeight: '700', color: textPrimary, marginTop: 10 }}>{performanceLabel}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
              <QuizStatCard label="corretas" value={correctCount} icon="check-circle" accentColor={QUIZ_COLORS.success} backgroundColor="rgba(34,197,94,0.09)" borderColor="rgba(34,197,94,0.25)" valueColor={QUIZ_COLORS.success} subtitleColor={textMuted} style={{ flex: 1, padding: 16 }} align="center" />
              <QuizStatCard label="erradas" value={wrongCount} icon="cancel" accentColor={QUIZ_COLORS.danger} backgroundColor="rgba(239,68,68,0.09)" borderColor="rgba(239,68,68,0.25)" valueColor={QUIZ_COLORS.danger} subtitleColor={textMuted} style={{ flex: 1, padding: 16 }} align="center" />
              <QuizStatCard label="total" value={totalCards} icon="quiz" accentColor={QUIZ_COLORS.primary} backgroundColor="rgba(63,81,181,0.09)" borderColor="rgba(63,81,181,0.25)" valueColor={QUIZ_COLORS.primary} subtitleColor={textMuted} style={{ flex: 1, padding: 16 }} align="center" />
            </View>

            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(63,81,181,0.08)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: 'rgba(63,81,181,0.22)' }}>
                <MaterialIcons name="school" size={14} color="#3F51B5" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#3F51B5', letterSpacing: 0.2 }}>{isMasterTest ? 'Teste Master' : `${decodedCategory} · ${activeDifficulty}`}</Text>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              {isPlanFlow && nextPlanStep ? (
                <QuizActionButton
                  label={nextPlanStep.kind === 'documentation' ? 'Ler próximo tópico' : 'Continuar para o próximo quiz'}
                  icon={nextPlanStep.kind === 'documentation' ? 'auto-stories' : 'play-arrow'}
                  trailingIcon="arrow-forward"
                  onPress={() => router.replace(nextPlanStep.href as never)}
                  variant="primary-solid"
                />
              ) : null}
              <QuizActionButton
                label={isPlanFlow ? 'Refazer esta categoria' : 'Tentar novamente'}
                icon="replay"
                onPress={() => {
                  setCurrentIndex(0);
                  setAnswer({ selectedIndex: null, revealed: false });
                  setCorrectCount(0);
                  setFinished(false);
                  startTimeRef.current = Date.now();
                  questionStartTimeRef.current = Date.now();
                  setQuestionElapsedSeconds(0);
                }}
                variant={isPlanFlow && nextPlanStep ? 'secondary' : 'primary-solid'}
              />
              <QuizActionButton
                label={isPlanFlow ? 'Voltar ao planejamento' : 'Voltar às categorias'}
                icon={isPlanFlow ? 'format-list-bulleted' : 'grid-view'}
                onPress={() => router.back()}
                variant="secondary"
                colors={{ backgroundColor: cardBg, pressedBackgroundColor: isDark ? '#252A31' : '#EEF2F6', borderColor: cardBorder, textColor: textMuted }}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-5 dark:bg-[#151718]" style={[isDesktopLayout ? { alignItems: 'center', paddingTop: 32 } : { paddingTop: topPadding }]}>
      <View style={[{ flex: 1 }, isDesktopLayout ? { width: '60%', alignSelf: 'center' } : undefined]}>
        {/* Custom header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#1C1F24',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}>
            <MaterialIcons name="arrow-back" size={20} color="#ECEDEE" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#ECEDEE' : '#11181C' }}>{contextLabel}</Text>
          </View>
        </View>

        <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E6E8EB] dark:bg-[#2A2F36]">
          <View className="h-full rounded-full bg-[#3F51B5]" style={{ width: `${progressPercent}%` }} />
        </View>

        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="rounded-full bg-[#F59E0B]/10 px-2.5 py-0.5">
              <Text className="text-xs font-semibold text-[#F59E0B]">
                {Math.floor(questionElapsedSeconds / 60)}:{(questionElapsedSeconds % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          </View>
          <Text className="text-xs font-semibold text-[#687076] dark:text-[#9BA1A6]">{currentIndex + 1} / {totalCards}</Text>
        </View>

        <ScrollView ref={scrollViewRef} className="mt-4 flex-1" showsVerticalScrollIndicator={false}>
          {currentCard && (
            <>
              <View className="mb-2 flex-row flex-wrap items-center gap-2">
                <View
                  className="rounded-full px-2.5 py-1"
                  style={{
                    backgroundColor:
                      currentCard.difficulty === 'Fácil'
                        ? 'rgba(34,197,94,0.12)'
                        : currentCard.difficulty === 'Médio'
                          ? 'rgba(245,158,11,0.12)'
                          : 'rgba(239,68,68,0.12)',
                  }}>
                  <Text
                    className="text-[10px] font-bold"
                    style={{
                      color:
                        currentCard.difficulty === 'Fácil'
                          ? '#22C55E'
                          : currentCard.difficulty === 'Médio'
                            ? '#F59E0B'
                            : '#EF4444',
                    }}>
                    {currentCard.difficulty.toUpperCase()}
                  </Text>
                </View>
                <View className="rounded-full bg-[#3F51B5]/10 px-2.5 py-1">
                  <Text className="text-[10px] font-bold text-[#3F51B5]">{currentCard.category}</Text>
                </View>
              </View>

              <View className="min-h-[180px] items-center justify-center rounded-2xl border border-[#E6E8EB] bg-[#F8FAFC] px-5 py-6 dark:border-[#30363D] dark:bg-[#1E2228]">
                <GlossaryText text={currentCard.question} track={decodedTrack} className="text-center text-lg font-bold leading-7 text-[#11181C] dark:text-[#ECEDEE]" />
              </View>

              <View className="mt-5 gap-3">
                {currentCard.options.map((option, index) => (
                  <AnswerOption key={index} letter={OPTION_LETTERS[index]} label={option} status={getOptionStatus(index)} onPress={() => handleSelect(index)} disabled={answer.revealed} isDark={isDark} />
                ))}
              </View>

              {answer.revealed && (
                <View className="mt-5 pb-8">
                  <Text className={`text-center text-sm font-semibold ${answer.selectedIndex === currentCard.correctIndex ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {answer.selectedIndex === currentCard.correctIndex ? 'Resposta correta!' : 'Resposta incorreta'}
                  </Text>

                  {(currentCard.explanation || currentCard.example) && (
                    <View className="mt-4 rounded-2xl border border-[#D1D9E0] bg-[#F0F4F8] px-5 py-4 dark:border-[#30363D] dark:bg-[#1E2228]">
                      {currentCard.explanation ? (
                        <>
                          <Text className="text-xs font-bold uppercase tracking-wide text-[#3F51B5]">Explicação</Text>
                          <GlossaryText text={currentCard.explanation} track={decodedTrack} className="mt-1.5 text-sm leading-5 text-[#11181C] dark:text-[#ECEDEE]" />
                        </>
                      ) : null}

                      {currentCard.example ? (
                        <View className={currentCard.explanation ? 'mt-4' : ''}>
                          <Text className="text-xs font-bold uppercase tracking-wide text-[#F59E0B]">Exemplo</Text>
                          <View className="mt-1.5 rounded-lg bg-[#E6E8EB] px-3 py-2.5 dark:bg-[#2A2F36]">
                            <Text className="text-sm leading-5 text-[#11181C] dark:text-[#ECEDEE]">{currentCard.example}</Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  )}

                  <QuizActionButton label={currentIndex + 1 < totalCards ? 'Próxima' : 'Ver resultado'} icon={currentIndex + 1 < totalCards ? 'arrow-forward' : 'emoji-events'} onPress={handleNext} variant="primary-solid" style={{ marginTop: 16 }} />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>

      <StudyCompletionOverlay
        visible={showCompletionEffect}
        correctCount={correctCount}
        totalCards={totalCards}
        backgroundOpacity={completionBgOpacity}
        iconScale={completionIconScale}
        textOpacity={completionTextOpacity}
        ringScale={completionRingScale}
        ringOpacity={completionRingOpacity}
      />
      <StudyFeedbackOverlay feedbackType={feedbackType} iconOpacity={iconOpacity} iconScale={iconScale} />
    </View>
  );
}
