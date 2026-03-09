import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { GlossaryText } from '@/components/glossary-text';
import { useIsDesktop } from '@/hooks/use-is-desktop';
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
    type DifficultyProgress,
    type Flashcard,
    type UserLevel,
} from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

type AnswerState = {
  selectedIndex: number | null;
  revealed: boolean;
};

export default function StudySessionScreen() {
  const { track, category, mode } = useLocalSearchParams<{
    track: string;
    category: string;
    mode?: string;
  }>();
  const isMasterTest = mode === 'master-test';
  const router = useRouter();
  const { user } = useAuth();
  const { refreshUserProgress } = useData();

  const decodedCategory = useMemo(() => decodeURIComponent(category ?? ''), [category]);
  const decodedTrack = useMemo(() => decodeURIComponent(track ?? ''), [track]);
  const contextLabel = useMemo(
    () =>
      isMasterTest
        ? `🏆 TESTE MASTER · ${resolveTrackLabel(decodedTrack)}`.toLocaleUpperCase('pt-BR')
        : `${decodedTrack} · ${decodedCategory}`.toLocaleUpperCase('pt-BR'),
    [decodedTrack, decodedCategory, isMasterTest],
  );

  // ---- State ----
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [activeDifficulty, setActiveDifficulty] = useState<UserLevel>('Fácil');
  const [nextDifficulty, setNextDifficulty] = useState<UserLevel | null>(null);
  const [progressByDifficulty, setProgressByDifficulty] = useState<DifficultyProgress[]>([]);
  const [supplementalDifficulties, setSupplementalDifficulties] = useState<UserLevel[]>([]);
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

  // Pré-carrega e persiste os sons no dispositivo
  useEffect(() => {
    (async () => {
      // Configura sessão de áudio antes de qualquer playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        staysActiveInBackground: false,
      });

      // Garante que os assets estão baixados e em cache (web e native)
      await Asset.loadAsync([
        require('@/assets/songs/acertou.mp3'),
        require('@/assets/songs/errou.mp3'),
      ]);

      const [{ sound: correctSound }, { sound: wrongSound }] = await Promise.all([
        Audio.Sound.createAsync(require('@/assets/songs/acertou.mp3'), { shouldPlay: false }),
        Audio.Sound.createAsync(require('@/assets/songs/errou.mp3'), { shouldPlay: false }),
      ]);

      // Pré-aquece o contexto de áudio tocando a 0ms de volume — elimina latência do primeiro play
      await Promise.all([
        correctSound.setStatusAsync({ shouldPlay: true, positionMillis: 0, volume: 0 }).then(() =>
          correctSound.setStatusAsync({ shouldPlay: false, positionMillis: 0, volume: 1 }),
        ),
        wrongSound.setStatusAsync({ shouldPlay: true, positionMillis: 0, volume: 0 }).then(() =>
          wrongSound.setStatusAsync({ shouldPlay: false, positionMillis: 0, volume: 1 }),
        ),
      ]);

      correctSoundRef.current = correctSound;
      wrongSoundRef.current = wrongSound;
    })();
    return () => {
      correctSoundRef.current?.unloadAsync();
      wrongSoundRef.current?.unloadAsync();
    };
  }, []);

  // Auto-scroll até a explicação quando a resposta for revelada
  useEffect(() => {
    if (answer.revealed) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [answer.revealed]);

  const isWeb = Platform.OS === 'web';
  const isDesktopWidth = useIsDesktop();

  // ---- Load cards ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        if (cancelled) return;
        if (isMasterTest) {
          const masterTestCards = await fetchMasterTestCards(decodedTrack);
          if (!cancelled) {
            setCards(masterTestCards);
          }
          return;
        }

        const studyDeck = await fetchCards(
          decodedTrack,
          decodedCategory,
          user?.id,
        );
        if (!cancelled) {
          setCards(studyDeck.cards);
          setActiveDifficulty(studyDeck.activeDifficulty);
          setNextDifficulty(studyDeck.nextDifficulty);
          setProgressByDifficulty(studyDeck.progressByDifficulty);
          setSupplementalDifficulties(studyDeck.supplementalDifficulties);

          if (user && studyDeck.cards.length > 0) {
            const inProgress = await fetchInProgressLesson(
              user.id,
              decodedTrack,
              decodedCategory,
              studyDeck.activeDifficulty,
            );
            if (!cancelled && inProgress && inProgress.answeredCount > 0) {
              const resumedIndex = Math.min(
                inProgress.answeredCount,
                Math.max(0, studyDeck.cards.length - 1),
              );
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

  // ---- Question timer (pausa quando resposta é revelada) ----
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setQuestionElapsedSeconds(0);
  }, [currentIndex]);

  useEffect(() => {
    if (answer.revealed) return; // pausado enquanto aguarda próxima questão

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
      setQuestionElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, answer.revealed]);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex] as Flashcard | undefined;
  const progressPercent = totalCards > 0 ? ((currentIndex + (answer.revealed ? 1 : 0)) / totalCards) * 100 : 0;

  // ---- Handlers ----
  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answer.revealed || !currentCard) return;
      const isCorrect = optionIndex === currentCard.correctIndex;

      // Som dispara PRIMEIRO — antes de qualquer atualização de estado ou animação
      const soundRef = isCorrect ? correctSoundRef.current : wrongSoundRef.current;
      void soundRef?.setStatusAsync({ shouldPlay: true, positionMillis: 0 });

      const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
      if (isCorrect) setCorrectCount((c) => c + 1);
      setAnswer({ selectedIndex: optionIndex, revealed: true });

      // Ícone animado de acerto/erro
      setFeedbackType(isCorrect ? 'correct' : 'wrong');
      iconScale.setValue(0);
      iconOpacity.setValue(1);
      Animated.sequence([
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 4,
          tension: 160,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Salva resultado individual do card no histórico de rotação
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
    [
      answer.revealed,
      correctCount,
      currentCard,
      currentIndex,
      decodedCategory,
      decodedTrack,
      activeDifficulty,
      isMasterTest,
      totalCards,
      user,
      iconOpacity,
      iconScale,
    ],
  );

  const handleNext = useCallback(async () => {
    if (currentIndex + 1 < totalCards) {
      setCurrentIndex((i) => i + 1);
      setAnswer({ selectedIndex: null, revealed: false });
    } else {
      // Finished
      setFinished(true);
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
            await clearInProgressLesson(user.id, {
              track: decodedTrack,
              category: decodedCategory,
              difficulty: activeDifficulty,
            });
          }
          // Atualiza o perfil do usuário na comunidade
          if (user.name) {
            console.log('Atualizando perfil do usuário:', user.id, user.name);
            await updateUserProfile(user.id, user.name);
            console.log('Perfil atualizado com sucesso!');
          }
          // Refresh cached progress so other tabs are up to date
          await refreshUserProgress();
        } catch (error) {
          console.error('Erro ao salvar lição:', error);
        } finally {
          setSaving(false);
        }
      }
    }
  }, [currentIndex, totalCards, user, decodedCategory, decodedTrack, correctCount, activeDifficulty, isMasterTest, refreshUserProgress]);

  const accuracyPercent = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;
  const activeDifficultyProgress = useMemo(
    () => progressByDifficulty.find((item) => item.difficulty === activeDifficulty) ?? null,
    [activeDifficulty, progressByDifficulty],
  );
  const supplementalDifficultyLabel = useMemo(
    () => supplementalDifficulties.join(', '),
    [supplementalDifficulties],
  );

  // ---- Option style helpers ----
  const getOptionStyle = useCallback(
    (optionIndex: number) => {
      if (!answer.revealed) {
        return 'border-[#E6E8EB] bg-white dark:border-[#30363D] dark:bg-[#1C1F24]';
      }
      if (!currentCard) return '';
      if (optionIndex === currentCard.correctIndex) {
        return 'border-[#22C55E] bg-[#22C55E]/10';
      }
      if (optionIndex === answer.selectedIndex && optionIndex !== currentCard.correctIndex) {
        return 'border-[#EF4444] bg-[#EF4444]/10';
      }
      return 'border-[#E6E8EB] bg-white opacity-50 dark:border-[#30363D] dark:bg-[#1C1F24]';
    },
    [answer, currentCard],
  );

  const getLetterStyle = useCallback(
    (optionIndex: number) => {
      if (!answer.revealed) return 'bg-[#3F51B5]';
      if (!currentCard) return 'bg-[#3F51B5]';
      if (optionIndex === currentCard.correctIndex) return 'bg-[#22C55E]';
      if (optionIndex === answer.selectedIndex && optionIndex !== currentCard.correctIndex) return 'bg-[#EF4444]';
      return 'bg-[#9BA1A6]';
    },
    [answer, currentCard],
  );

  // ---- Loading state ----
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718]">
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text className="mt-3 text-[#687076] dark:text-[#9BA1A6]">Carregando quizzes...</Text>
      </View>
    );
  }

  // ---- Empty state ----
  if (totalCards === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5 dark:bg-[#151718]">
        <View>
        <Text className="text-lg font-bold text-[#11181C] dark:text-[#ECEDEE]">
          Nenhum quiz disponível
        </Text>
        <Text className="mt-2 text-center text-[#687076] dark:text-[#9BA1A6]">
          Esta categoria ainda não possui quizzes cadastrados.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-xl bg-[#3F51B5] px-6 py-3 active:opacity-70">
          <Text className="font-semibold text-white">Voltar</Text>
        </Pressable>
        </View>
      </View>
    );
  }

  // ---- Finished state ----
  if (finished) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5 dark:bg-[#151718]">
        <View>
        {saving ? (
          <ActivityIndicator size="large" color="#3F51B5" />
        ) : (
          <>
            <Text className="text-4xl font-bold text-[#11181C] dark:text-[#ECEDEE]">
              {accuracyPercent}%
            </Text>
            <Text className="mt-1 text-lg font-semibold text-[#687076] dark:text-[#9BA1A6]">
              de acertos
            </Text>
            <Text className="mt-4 text-[#11181C] dark:text-[#ECEDEE]">
              {correctCount} / {totalCards} corretas
            </Text>
            <View className="mt-8 w-full gap-3">
              <Pressable
                onPress={() => {
                  setCurrentIndex(0);
                  setAnswer({ selectedIndex: null, revealed: false });
                  setCorrectCount(0);
                  setFinished(false);
                  startTimeRef.current = Date.now();
                  questionStartTimeRef.current = Date.now();
                  setQuestionElapsedSeconds(0);
                }}
                className="rounded-xl bg-[#3F51B5] py-3 active:opacity-70">
                <Text className="text-center font-semibold text-white">Tentar novamente</Text>
              </Pressable>
              <Pressable
                onPress={() => router.back()}
                className="rounded-xl border border-[#E6E8EB] py-3 active:opacity-70 dark:border-[#30363D]">
                <Text className="text-center font-semibold text-[#11181C] dark:text-[#ECEDEE]">
                  Voltar às categorias
                </Text>
              </Pressable>
            </View>
          </>
        )}
        </View>
      </View>
    );
  }


  // ---- Exercise screen ----
  return (
    <View className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]" style={isDesktopWidth ? { alignItems: 'center' } : undefined}>
      <View
        style={[
          { flex: 1 },
          isDesktopWidth ? { width: '60%', alignSelf: 'center' } : isWeb ? { width: '100%', alignSelf: 'center' } : undefined,
        ]}>
      {/* Header */}
      {isDesktopWidth && (
        <Pressable
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, alignSelf: 'flex-start' }}>
          <MaterialIcons name="arrow-back" size={18} color="#687076" />
          <Text style={{ color: '#687076', fontSize: 14 }}>Voltar</Text>
        </Pressable>
      )}
      <Text className="text-xs font-medium tracking-wide text-[#687076] dark:text-[#9BA1A6]">
        {contextLabel}
      </Text>

      {!isMasterTest && (
        <View className="mt-3 rounded-2xl border border-[#E6E8EB] bg-[#F8FAFC] px-4 py-3 dark:border-[#30363D] dark:bg-[#1C1F24]">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-xs font-semibold uppercase tracking-wide text-[#3F51B5]">
              Nível atual: {activeDifficulty}
            </Text>
            <Text className="text-xs font-medium text-[#687076] dark:text-[#9BA1A6]">
              {activeDifficultyProgress?.masteryPercent ?? 0}% dominado
            </Text>
          </View>
          <Text className="mt-1 text-xs text-[#687076] dark:text-[#9BA1A6]">
            {nextDifficulty
              ? `Você só recebe questões ${nextDifficulty.toLowerCase()} depois de dominar 100% do nível ${activeDifficulty.toLowerCase()}.`
              : 'Você já liberou todos os níveis desta categoria.'}
          </Text>
          {supplementalDifficulties.length > 0 && (
            <Text className="mt-2 text-xs text-[#687076] dark:text-[#9BA1A6]">
              Esta lição foi completada com questões de {supplementalDifficultyLabel} porque não há cards suficientes em {activeDifficulty.toLowerCase()} para fechar {totalCards} perguntas.
            </Text>
          )}
        </View>
      )}

      {/* Progress bar */}
      <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E6E8EB] dark:bg-[#2A2F36]">
        <View
          className="h-full rounded-full bg-[#3F51B5]"
          style={{ width: `${progressPercent}%` }}
        />
      </View>

      {/* Counter + Difficulty */}
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-[#F59E0B]/10 px-2.5 py-0.5">
            <Text className="text-xs font-semibold text-[#F59E0B]">
              {Math.floor(questionElapsedSeconds / 60)}:{(questionElapsedSeconds % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
        <Text className="text-xs font-semibold text-[#687076] dark:text-[#9BA1A6]">
          {currentIndex + 1} / {totalCards}
        </Text>
      </View>

      <ScrollView ref={scrollViewRef} className="mt-4 flex-1" showsVerticalScrollIndicator={false}>
        {/* Question card */}
        {currentCard && (
          <>
            {/* Difficulty + Category badges */}
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
                <Text className="text-[10px] font-bold text-[#3F51B5]">
                  {currentCard.category}
                </Text>
              </View>
            </View>

            <View className="min-h-[180px] items-center justify-center rounded-2xl border border-[#E6E8EB] bg-[#F8FAFC] px-5 py-6 dark:border-[#30363D] dark:bg-[#1E2228]">
              <GlossaryText
                text={currentCard.question}
                track={decodedTrack}
                className="text-center text-lg font-bold leading-7 text-[#11181C] dark:text-[#ECEDEE]"
              />
            </View>

            {/* Options */}
            <View className="mt-5 gap-3">
              {currentCard.options.map((option, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSelect(idx)}
                  disabled={answer.revealed}
                  className={`flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70 ${getOptionStyle(idx)}`}>
                  <View className={`h-8 w-8 items-center justify-center rounded-full ${getLetterStyle(idx)}`}>
                    <Text className="text-sm font-bold text-white">{OPTION_LETTERS[idx]}</Text>
                  </View>
                  <Text className="flex-1 text-sm text-[#11181C] dark:text-[#ECEDEE]">{option}</Text>
                </Pressable>
              ))}
            </View>

            {/* Feedback + Explanation + Next */}
            {answer.revealed && (
              <View className="mt-5 pb-8">
                <Text
                  className={`text-center text-sm font-semibold ${
                    answer.selectedIndex === currentCard.correctIndex
                      ? 'text-[#22C55E]'
                      : 'text-[#EF4444]'
                  }`}>
                  {answer.selectedIndex === currentCard.correctIndex
                    ? 'Resposta correta!'
                    : 'Resposta incorreta'}
                </Text>

                {/* Explanation card */}
                {(currentCard.explanation || currentCard.example) && (
                  <View className="mt-4 rounded-2xl border border-[#D1D9E0] bg-[#F0F4F8] px-5 py-4 dark:border-[#30363D] dark:bg-[#1E2228]">
                    {currentCard.explanation ? (
                      <>
                        <Text className="text-xs font-bold uppercase tracking-wide text-[#3F51B5]">
                          Explicação
                        </Text>
                        <GlossaryText
                          text={currentCard.explanation}
                          track={decodedTrack}
                          className="mt-1.5 text-sm leading-5 text-[#11181C] dark:text-[#ECEDEE]"
                        />
                      </>
                    ) : null}

                    {currentCard.example ? (
                      <View className={currentCard.explanation ? 'mt-4' : ''}>
                        <Text className="text-xs font-bold uppercase tracking-wide text-[#F59E0B]">
                          Exemplo
                        </Text>
                        <View className="mt-1.5 rounded-lg bg-[#E6E8EB] px-3 py-2.5 dark:bg-[#2A2F36]">
                          <Text className="text-sm leading-5 text-[#11181C] dark:text-[#ECEDEE]">
                            {currentCard.example}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                )}

                <Pressable
                  onPress={handleNext}
                  className="mt-4 rounded-xl bg-[#3F51B5] py-3 active:opacity-70">
                  <Text className="text-center text-sm font-semibold text-white">
                    {currentIndex + 1 < totalCards ? 'Próxima' : 'Ver resultado'}
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
      </View>

      {/* Ícone de feedback centralizado (acerto/erro) */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          alignItems: 'center', justifyContent: 'center',
          opacity: iconOpacity,
        }}>
        <Animated.View
          style={{
            transform: [{ scale: iconScale }],
            width: 120, height: 120, borderRadius: 60,
            backgroundColor: feedbackType === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <MaterialIcons
            name={feedbackType === 'correct' ? 'check-circle' : 'cancel'}
            size={88}
            color={feedbackType === 'correct' ? '#22C55E' : '#EF4444'}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
