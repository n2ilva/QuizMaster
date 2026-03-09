import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { SCORE_LEVEL_EMOJIS, SCORE_LEVEL_NAMES } from '@/constants/score-levels';
import { trackLabels } from '@/data/tracks';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useTabContentPadding } from '@/hooks/use-tab-content-padding';
import {
    type CategoryProgress,
    fetchUserProgress,
    formatDuration,
    getScoreLevel,
    resetUserProgress,
    type ScoreLevel,
} from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

function ResetProgressButton({
  onPress,
  resetting,
  compact = false,
}: {
  onPress: () => void;
  resetting: boolean;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={resetting}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.4)',
        backgroundColor: pressed ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)',
        paddingHorizontal: compact ? 12 : 16,
        paddingVertical: compact ? 8 : 10,
        opacity: resetting ? 0.7 : 1,
        alignSelf: compact ? 'flex-end' : 'stretch',
      })}>
      <MaterialIcons name="delete-outline" size={compact ? 15 : 16} color="#EF4444" />
      <Text style={{ color: '#EF4444', fontSize: compact ? 12 : 13, fontWeight: '600' }}>
        {resetting ? 'Resetando...' : 'Resetar progresso'}
      </Text>
    </Pressable>
  );
}

function CategoryCard({ cat }: { cat: CategoryProgress }) {
  return (
    <View
      className="w-full rounded-xl border border-[#E6E8EB] p-3 dark:border-[#30363D]">
      <Text className="text-sm font-semibold text-[#11181C] dark:text-[#ECEDEE]">
        {(trackLabels[cat.track] ?? cat.track) ? `${trackLabels[cat.track] ?? cat.track} · ${cat.category}` : cat.category}
      </Text>
      <View className="mt-2 flex-row justify-between">
        <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">
          Estudo: {cat.studyPercent}%
        </Text>
        <Text
          className="text-xs font-semibold"
          style={{ color: cat.accuracyPercent >= 80 ? '#22C55E' : '#EF4444' }}>
          Acertos: {cat.accuracyPercent}%
        </Text>
      </View>
      <View className="mt-1 flex-row justify-between">
        <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">
          Tempo/questão: {formatDuration(cat.avgTimePerQuestionMs)}
        </Text>
        <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">
          {cat.uniqueQuestionsAnswered} {cat.uniqueQuestionsAnswered === 1 ? 'pergunta' : 'perguntas'}
        </Text>
      </View>

      {cat.hasInProgressLesson ? (
        <View className="mt-1 rounded-lg border border-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1">
          <Text className="text-xs font-medium text-[#B45309] dark:text-[#FBBF24]">
            Em andamento: {cat.inProgressAnswered} {cat.inProgressAnswered === 1 ? 'pergunta respondida' : 'perguntas respondidas'}
          </Text>
        </View>
      ) : null}

      <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E6E8EB] dark:bg-[#2A2F36]">
        <View
          className="h-full rounded-full"
          style={{
            width: `${cat.studyPercent}%`,
            backgroundColor: '#3F51B5',
          }}
        />
      </View>

      <Link
        href={cat.hasInProgressLesson
          ? `/ready/study?track=${encodeURIComponent(cat.track)}&category=${encodeURIComponent(cat.category)}`
          : `/ready/${encodeURIComponent(cat.track)}`
        }
        asChild>
        <Pressable className="mt-3 flex-row items-center justify-center gap-1.5 rounded-lg bg-[#3F51B5]/10 py-2 active:opacity-70">
          <MaterialIcons
            name={cat.hasInProgressLesson ? 'play-arrow' : 'replay'}
            size={16}
            color="#3F51B5"
          />
          <Text className="text-xs font-semibold text-[#3F51B5]">
            {cat.hasInProgressLesson ? 'Continuar' : 'Estudar'}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

export default function ProgressScreen() {
  const bottomPadding = useTabContentPadding();
  const { user } = useAuth();
  const { userProgress: cachedProgress, refreshUserProgress } = useData();
  const isDesktop = useIsDesktop();

  const [loading, setLoading] = useState(!cachedProgress);
  const [resetting, setResetting] = useState(false);
  const [scoreLevel, setScoreLevel] = useState<ScoreLevel>(cachedProgress ? getScoreLevel(cachedProgress.totalScore) : 'Bronze');
  const [score, setScore] = useState(cachedProgress?.totalScore ?? 0);
  const [accuracy, setAccuracy] = useState(cachedProgress?.accuracyPercent ?? 0);
  const [totalLessons, setTotalLessons] = useState(cachedProgress?.totalLessons ?? 0);
  const [streak, setStreak] = useState(cachedProgress?.streak ?? 0);
  const [categories, setCategories] = useState<CategoryProgress[]>(cachedProgress?.categories ?? []);
  const isFirstLoad = useRef(true);

  const loadProgress = useCallback(async () => {
    if (!user) return;
    // Skip the first fetch if we already have cached data
    if (isFirstLoad.current && cachedProgress) {
      isFirstLoad.current = false;
      return;
    }
    isFirstLoad.current = false;
    try {
      setLoading(true);
      const data = await fetchUserProgress(user.id);
      setAccuracy(data.accuracyPercent);
      setTotalLessons(data.totalLessons);
      setStreak(data.streak);
      setCategories(data.categories);

      // Usa o score calculado por fetchUserProgress
      setScore(data.totalScore);
      setScoreLevel(getScoreLevel(data.totalScore));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [user, cachedProgress]);

  useFocusEffect(
    useCallback(() => {
      void loadProgress();
    }, [loadProgress])
  );

  const handleReset = useCallback(() => {
    if (!user) return;

    const doReset = async () => {
      try {
        setResetting(true);
        await resetUserProgress(user.id);
        // Reload data after reset
        await refreshUserProgress();
        void loadProgress();

        if (Platform.OS === 'web') {
          alert('Progresso resetado com sucesso!');
        } else {
          Alert.alert('Sucesso', 'Progresso resetado com sucesso!');
        }
      } catch (error) {
        console.error('Reset error:', error);
        if (Platform.OS === 'web') {
          alert('Falha ao resetar progresso. Tente novamente.');
        } else {
          Alert.alert('Erro', 'Falha ao resetar progresso. Tente novamente.');
        }
      } finally {
        setResetting(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Tem certeza? Todas as suas lições completadas e em andamento serão deletadas permanentemente.',
      );
      if (confirmed) void doReset();
    } else {
      Alert.alert(
        'Resetar progresso',
        'Tem certeza? Todas as suas lições completadas e em andamento serão deletadas permanentemente.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Resetar', style: 'destructive', onPress: () => void doReset() },
        ],
      );
    }
  }, [user, loadProgress, refreshUserProgress]);

  if (isDesktop) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 36, paddingBottom: bottomPadding + 24 }}>

        {/* ── Cabeçalho ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Sua evolução</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 6 }}>Acompanhe seu desempenho e identifique onde melhorar.</Text>
          </View>
          {totalLessons > 0 && (
            <ResetProgressButton onPress={handleReset} resetting={resetting} compact />
          )}
        </View>

        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <ActivityIndicator size="large" color="#818CF8" />
          </View>
        ) : (
          <>
            {/* ── Faixa de métricas (4 cards) ── */}
            <View style={{ flexDirection: 'row', gap: 14, marginBottom: 32 }}>

              {/* Lições */}
              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: '#1E2328' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(99,102,241,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <MaterialIcons name="school" size={20} color="#818CF8" />
                </View>
                <Text style={{ color: '#ECEDEE', fontSize: 30, fontWeight: '800' }}>{totalLessons}</Text>
                <Text style={{ color: '#687076', fontSize: 12, marginTop: 4 }}>Lições concluídas</Text>
              </View>

              {/* Acerto médio */}
              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: accuracy >= 80 ? '#1E2328' : 'rgba(239,68,68,0.4)' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: accuracy >= 80 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <MaterialIcons name={accuracy >= 80 ? 'check-circle' : 'trending-down'} size={20} color={accuracy >= 80 ? '#22C55E' : '#EF4444'} />
                </View>
                <Text style={{ color: accuracy >= 80 ? '#ECEDEE' : '#EF4444', fontSize: 30, fontWeight: '800' }}>{accuracy}<Text style={{ fontSize: 18, color: accuracy >= 80 ? '#687076' : '#EF4444' }}>%</Text></Text>
                <Text style={{ color: accuracy >= 80 ? '#687076' : '#EF4444', fontSize: 12, marginTop: 4 }}>Média de acertos</Text>
              </View>

              {/* Pontuação / nível */}
              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: '#3F51B5' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Text style={{ fontSize: 26 }}>{SCORE_LEVEL_EMOJIS[scoreLevel]}</Text>
                  <View style={{ backgroundColor: '#3F51B520', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: '#818CF8', fontSize: 11, fontWeight: '700' }}>{SCORE_LEVEL_NAMES[scoreLevel]}</Text>
                  </View>
                </View>
                <Text style={{ color: '#ECEDEE', fontSize: 30, fontWeight: '800' }}>{score}</Text>
                <Text style={{ color: '#687076', fontSize: 12, marginTop: 4 }}>Pontos totais</Text>
              </View>

              {/* Streak */}
              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: streak > 0 ? 'rgba(245,158,11,0.35)' : '#1E2328' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: streak > 0 ? 'rgba(245,158,11,0.15)' : '#1E2328', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Text style={{ fontSize: 20 }}>🔥</Text>
                </View>
                <Text style={{ color: streak > 0 ? '#FBBF24' : '#4B5563', fontSize: 30, fontWeight: '800' }}>{streak}</Text>
                <Text style={{ color: '#687076', fontSize: 12, marginTop: 4 }}>{streak === 1 ? 'Dia consecutivo' : 'Dias consecutivos'}</Text>
              </View>
            </View>

            {/* ── Progresso por categoria ── */}
            <View style={{ backgroundColor: '#0D0F10', borderRadius: 18, borderWidth: 1, borderColor: '#1E2328', padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="trending-up" size={17} color="#22C55E" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ECEDEE', fontSize: 16, fontWeight: '700' }}>Progresso por tema</Text>
                    <Text style={{ color: '#687076', fontSize: 12 }}>Histórico de categorias estudadas</Text>
                  </View>
                  {categories.length > 0 && (
                    <View style={{ backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: '#22C55E', fontSize: 11, fontWeight: '700' }}>{categories.length}</Text>
                    </View>
                  )}
                </View>

                {categories.length === 0 ? (
                  <View style={{ backgroundColor: '#0D0F10', borderRadius: 16, borderWidth: 1, borderColor: '#1E2328', padding: 32, alignItems: 'center' }}>
                    <MaterialIcons name="book" size={32} color="#4B5563" />
                    <Text style={{ color: '#687076', fontSize: 14, marginTop: 10 }}>Nenhuma lição concluída ainda.</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 32 }}>
                    {categories.map((cat) => {
                      const statusColor = cat.accuracyPercent >= 80 ? '#22C55E' : '#EF4444';
                      return (
                        <Link
                          key={`${cat.track}__${cat.category}`}
                          href={cat.hasInProgressLesson
                            ? `/ready/study?track=${encodeURIComponent(cat.track)}&category=${encodeURIComponent(cat.category)}`
                            : `/ready/${encodeURIComponent(cat.track)}`}
                          asChild>
                          <Pressable style={({ pressed }) => ({
                            width: '31%',
                            backgroundColor: pressed ? '#191C20' : '#0D0F10',
                            borderRadius: 16,
                            borderWidth: 1.5,
                            borderStyle: 'solid',
                            borderColor: statusColor,
                            padding: 18,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 6,
                            elevation: 4,
                          })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                              <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '600', flex: 1 }} numberOfLines={2}>{cat.category}</Text>
                              <Text style={{ color: statusColor, fontSize: 18, fontWeight: '800', marginLeft: 8 }}>{cat.accuracyPercent}%</Text>
                            </View>
                            <Text style={{ color: '#6B7280', fontSize: 11, marginBottom: 10 }} numberOfLines={1}>
                              {trackLabels[cat.track] ?? cat.track} · {formatDuration(cat.avgTimePerQuestionMs)}/questão
                            </Text>
                            <View style={{ height: 4, backgroundColor: '#1E2328', borderRadius: 4, overflow: 'hidden' }}>
                              <View style={{ height: '100%', width: `${cat.studyPercent}%`, backgroundColor: '#818CF8', borderRadius: 4 }} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                              <Text style={{ color: '#6B7280', fontSize: 10 }}>{cat.studyPercent}% visto</Text>
                              {cat.hasInProgressLesson && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(245,158,11,0.12)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}>
                                  <MaterialIcons name="play-arrow" size={10} color="#F59E0B" />
                                  <Text style={{ color: '#F59E0B', fontSize: 9, fontWeight: '600' }}>Em andamento</Text>
                                </View>
                              )}
                            </View>
                          </Pressable>
                        </Link>
                      );
                    })}
                  </View>
                )}
            </View>

          </>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">Sua evolução</Text>
        {totalLessons > 0 && (
          <ResetProgressButton onPress={handleReset} resetting={resetting} compact />
        )}
      </View>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">
          Veja seu avanço por tema.
      </Text>

      {loading ? (
        <View className="mt-20 items-center">
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <>
          {/* Stats cards row */}
          <View className="mt-5 gap-3">
            {/* Summary card */}
            <View className="rounded-2xl bg-[#3F51B5] p-4">
              <Text className="text-sm text-white/80">Resumo geral</Text>
              <Text className="mt-2 text-3xl font-bold text-white">
                {totalLessons}
              </Text>
              <Text className="mt-1 text-sm text-white/70">
                {totalLessons === 1 ? 'lição concluída' : 'lições concluídas'}
              </Text>
              <Text className="mt-3 text-sm text-white/70">
                Média de acerto:{' '}
                <Text
                  className="font-semibold"
                  style={{ color: accuracy >= 80 ? '#ffffff' : '#FCA5A5' }}>
                  {accuracy}%
                </Text>
              </Text>
            </View>

            {/* Medal card */}
            <View className="items-center justify-center rounded-2xl border-2 border-[#3F51B5] bg-[#3F51B5]/5 p-4">
              <Text className="text-5xl">{SCORE_LEVEL_EMOJIS[scoreLevel]}</Text>
              <Text className="mt-2 text-lg font-bold text-[#3F51B5]">
                {SCORE_LEVEL_NAMES[scoreLevel]}
              </Text>
              <Text className="mt-1 text-sm text-[#687076] dark:text-[#9BA1A6]">
                {score} pontos
              </Text>
            </View>
          </View>

      {/* Streak card */}
      {streak > 0 && (
        <View className="mt-3 flex-row items-center gap-3 rounded-2xl bg-[#F59E0B]/10 p-4">
          <Text className="text-3xl">🔥</Text>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-[#D97706] dark:text-[#FBBF24]">
              {streak} {streak === 1 ? 'dia' : 'dias'} consecutivos
            </Text>
            <Text className="mt-0.5 text-xs text-[#B45309] dark:text-[#FCD34D]">
              Continue estudando para manter sua sequência!
            </Text>
          </View>
        </View>
      )}

      {/* Progress by category */}
      <View className="mt-5 overflow-hidden rounded-2xl border border-[#22C55E]/20 dark:border-[#22C55E]/30">
        {/* Header */}
        <View style={{ backgroundColor: 'rgba(34,197,94,0.08)' }} className="flex-row items-center gap-3 px-4 py-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]/15">
            <MaterialIcons name="trending-up" size={20} color="#22C55E" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-[#22C55E]">
              Progresso por tema
            </Text>
            <Text className="text-[11px] text-[#687076] dark:text-[#9BA1A6]">
              Acompanhe sua evolução em cada categoria
            </Text>
          </View>
          {categories.length > 0 && (
            <View className="rounded-full bg-[#22C55E]/15 px-2 py-0.5">
              <Text className="text-[10px] font-bold text-[#22C55E]">{categories.length}</Text>
            </View>
          )}
        </View>

        {/* List */}
        {categories.length === 0 ? (
          <View className="p-3">
            <Text className="py-2 text-center text-[#687076] dark:text-[#9BA1A6]">
              Conclua lições para exibir progresso.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ maxHeight: 320 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={{ padding: 12 }}>
            {categories.map((cat, index) => (
              <View key={`${cat.track}__${cat.category}`}>
                {index > 0 && (
                  <View className="my-2 h-px bg-[#E6E8EB] dark:bg-[#30363D]" />
                )}
                <CategoryCard cat={cat} />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
        </>
      )}
    </ScrollView>
  );
}
