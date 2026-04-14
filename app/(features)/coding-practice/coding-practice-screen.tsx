import { Audio } from 'expo-av';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';

import {
  LANGUAGE_TOKENS,
  LANGUAGES,
  type LanguageInfo,
} from './coding-practice.constants';
import { type Exercise, type Language, type PlacedToken } from './coding-practice.types';

// JSON data source — exercises loaded from file (swappable for API later)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exercisesData = require('./data/exercises.json') as { exercises: Exercise[] };
const ALL_EXERCISES: Exercise[] = exercisesData.exercises;
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

// ─── helpers ─────────────────────────────────────────────
function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

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

  const [selectedLang, setSelectedLang] = useState<LanguageInfo>(LANGUAGES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [placed, setPlaced] = useState<PlacedToken[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const playSound = async (type: 'concluido' | 'erro') => {
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
  };

  const exercisesForLang = useMemo(
    () => ALL_EXERCISES.filter((e) => e.language === (selectedLang.id as Language)),
    [selectedLang.id],
  );

  const categories = useMemo(() => {
    return Array.from(new Set(exercisesForLang.map((e) => e.exerciseType)));
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
    setIsCorrect(null);
    setHintIndex(0);
    setStartTime(Date.now());
  }, []);

  const handleBack = useCallback(() => {
    setActiveExercise(null);
    setPlaced([]);
    setIsCorrect(null);
    setHintIndex(0);
    setStartTime(null);
  }, []);

  const handleRestartExercise = useCallback(() => {
    setPlaced([]);
    setIsCorrect(null);
    setHintIndex(0);
    setStartTime(Date.now());
  }, []);

  const handleAddToken = useCallback((token: { id: string }) => {
    setPlaced((prev) => [...prev, { instanceId: uid(), tokenId: token.id }]);
    setIsCorrect(null);
  }, []);

  const handleRemove = useCallback((instanceId: string) => {
    setPlaced((prev) => prev.filter((p) => p.instanceId !== instanceId));
    setIsCorrect(null);
  }, []);

  const handleRename = useCallback((instanceId: string, newLabel: string) => {
    setPlaced((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, customLabel: newLabel } : p)),
    );
  }, []);

  const handleClear = useCallback(() => {
    setPlaced([]);
    setIsCorrect(null);
  }, []);

  const handleValidate = useCallback(async () => {
    if (!activeExercise || placed.length === 0) return;
    const correct = validate(placed, activeExercise);
    setIsCorrect(correct);
    if (correct) {
      if (startTime) setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      await playSound('concluido');
    } else {
      await playSound('erro');
      setTimeout(() => {
        setIsCorrect(null);
      }, 1000);
    }
  }, [activeExercise, placed, startTime]);

  const handleShowHint = useCallback(() => {
    const max = activeExercise?.hints?.length ?? 0;
    if (hintIndex < max) setHintIndex((h) => h + 1);
  }, [hintIndex, activeExercise]);

  // ─────────────────────────────────────────────
  // VIEW: Exercise List
  // ─────────────────────────────────────────────
  if (!activeExercise) {
    return (
      <View className="flex-1 bg-white dark:bg-[#151718]">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding + 16 }}
        >
          {/* Header - Padrão Quiz/Categorias */}
          <View className="px-5 mb-4 mt-5">
            <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">
              Prática de Código
            </Text>
            <Text className="mt-1 text-[#687076] dark:text-[#9BA1A6] text-sm">
              Monte a sintaxe como blocos de quebra-cabeça.
            </Text>
          </View>

          {/* Body limited container */}
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
                <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
                <Text style={{ color: '#6B7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Topicos de Estudo</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {categories.map((cat) => {
                  const count = exercisesForLang.filter((e) => e.exerciseType === cat).length;
                  return (
                    <CategoryGridCard
                      key={cat}
                      categoryName={cat}
                      count={count}
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
                      onPress={() => handleSelectExercise(ex)}
                    />
                  ))
                )}
              </View>
            </View>
          )}
        </View>
        </ScrollView>
      </View>
    );
  }

  // ─────────────────────────────────────────────
  // VIEW: Active Exercise — Duolingo layout
  //   1) Pergunta (topo)
  //   2) Área de resposta (meio)
  //   3) Peças disponíveis (baixo)
  //   4) Botão verificar (fixo)
  // ─────────────────────────────────────────────
  return (
    <View className="flex-1 bg-white dark:bg-[#151718]">
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
              onHideHints={() => setHintIndex(0)}
            />

            {/* ② Área de resposta */}
            <AnswerArea
              placed={placed}
              allTokens={availableTokens}
              onRemove={handleRemove}
              onRename={handleRename}
              onClear={handleClear}
              isCorrect={isCorrect}
              expectedCount={activeExercise.solution.length}
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
          {isCorrect === true ? (
            <View style={{ padding: 16, backgroundColor: 'rgba(16, 185, 129, 0.05)', borderTopWidth: 2, borderTopColor: '#10B981', gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <MaterialIcons name="check-circle" size={40} color="#10B981" />
                <View>
                  <Text style={{ color: '#10B981', fontSize: 20, fontWeight: '900' }}>Incrível!</Text>
                  <Text style={{ color: '#9BA1A6', fontSize: 13, marginTop: 2 }}>
                    Solução exata | Tempo de refatoração: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={handleRestartExercise}
                  style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#2D3748', alignItems: 'center' }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#F9FAFB', fontWeight: 'bold' }}>Fazer Novamente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleBack}
                  style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#10B981', alignItems: 'center' }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#111827', fontWeight: 'bold' }}>Concluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {/* ③ Teclado de peças — fixo, sempre visível */}
              <TokenKeyboard
                tokens={availableTokens}
                onAddToken={handleAddToken}
              />

              {/* ④ Botão verificar */}
              <ValidateButton
                onPress={handleValidate}
                disabled={placed.length === 0}
                isCorrect={isCorrect}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
