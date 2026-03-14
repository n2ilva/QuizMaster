import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { SCORE_LEVEL_EMOJIS } from '@/constants/score-levels';
import { TRACK_STYLE_FALLBACK, trackStyles } from '@/constants/track-styles';
import { trackLabels } from '@/data/tracks';
import { useScreenSize } from '@/hooks/use-screen-size';
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
  const acc = cat.accuracyPercent;
  const accentColor = acc === 100 ? '#22C55E' : acc >= 80 ? '#10B981' : acc >= 50 ? '#F59E0B' : '#EF4444';
  const trackStyle = trackStyles[cat.track] ?? TRACK_STYLE_FALLBACK;
  const trackLabel = trackLabels[cat.track] ?? cat.track;

  return (
    <View style={{ backgroundColor: accentColor, borderRadius: 16, padding: 2, overflow: 'hidden' }}>
      <View style={{ backgroundColor: '#111316', borderRadius: 14, padding: 14 }}>

        {/* Header: ícone + nome + % acerto */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <View style={{ backgroundColor: trackStyle.color + '22', borderRadius: 9, padding: 7, marginTop: 1 }}>
            <MaterialIcons name={trackStyle.icon} size={14} color={trackStyle.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#6B7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }} numberOfLines={1}>
              {trackLabel}
            </Text>
            <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '700', marginTop: 2, lineHeight: 18 }} numberOfLines={2}>
              {cat.category}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: accentColor, fontSize: 20, fontWeight: '800', lineHeight: 22 }}>
              {acc}%
            </Text>
            <Text style={{ color: '#6B7280', fontSize: 10, marginTop: 1 }}>acertos</Text>
          </View>
        </View>

        {/* Barra de progresso de estudo */}
        <View style={{ height: 5, backgroundColor: '#1E2328', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
          <View style={{ height: '100%', borderRadius: 4, width: `${cat.studyPercent}%`, backgroundColor: accentColor, opacity: 0.65 }} />
        </View>

        {/* Stats secundárias */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ color: '#6B7280', fontSize: 11 }}>
            {cat.studyPercent}% estudado · {cat.uniqueQuestionsAnswered} {cat.uniqueQuestionsAnswered === 1 ? 'questão' : 'questões'}
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 11 }}>
            {formatDuration(cat.avgTimePerQuestionMs)}/q
          </Text>
        </View>

        {cat.hasInProgressLesson ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F59E0B22', borderWidth: 1, borderColor: '#F59E0B44', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginBottom: 8 }}>
            <MaterialIcons name="schedule" size={12} color="#F59E0B" />
            <Text style={{ color: '#F59E0B', fontSize: 11, fontWeight: '600' }}>
              Em andamento · {cat.inProgressAnswered} {cat.inProgressAnswered === 1 ? 'resposta' : 'respostas'}
            </Text>
          </View>
        ) : null}

        {acc < 50 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF444422', borderWidth: 1, borderColor: '#EF444444', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginBottom: 8 }}>
            <MaterialIcons name="warning" size={12} color="#EF4444" />
            <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '600' }}>
              Taxa baixa — revise este tema
            </Text>
          </View>
        ) : null}

        <Link
          href={cat.hasInProgressLesson
            ? `/ready/study?track=${encodeURIComponent(cat.track)}&category=${encodeURIComponent(cat.category)}`
            : `/ready/${encodeURIComponent(cat.track)}`
          }
          asChild>
          <Pressable
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: pressed ? '#1e2a5e33' : '#1A1D21',
              borderWidth: 1,
              borderColor: '#3F51B580',
              borderRadius: 10,
              paddingVertical: 9,
            })}>
            <MaterialIcons
              name={cat.hasInProgressLesson ? 'play-arrow' : 'replay'}
              size={15}
              color="#818CF8"
            />
            <Text style={{ color: '#818CF8', fontSize: 13, fontWeight: '700' }}>
              {cat.hasInProgressLesson ? 'Continuar' : 'Estudar'}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const bottomPadding = useTabContentPadding();
  const { user } = useAuth();
  const { userProgress: cachedProgress, refreshUserProgress } = useData();
  const { isDesktop, isTablet, isMobile } = useScreenSize();
  const { width: windowWidth } = useWindowDimensions();
  // Sidebar 240 + outer padding 36×2 + card padding 16×2 = 344
  const catGridCols = isDesktop ? (windowWidth >= 1500 ? 5 : 3) : 2;
  const catGridGap = 12;
  const catItemWidth = isDesktop
    ? (windowWidth - 344 - (catGridCols - 1) * catGridGap) / catGridCols
    : (windowWidth - 104 - (catGridCols - 1) * catGridGap) / catGridCols;

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

  if (isDesktop || isTablet) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 36,
          paddingTop: 36,
          paddingBottom: bottomPadding + 24,
        }}>

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
            <View style={{ flexDirection: 'row', gap: 14, marginBottom: 32, flexWrap: 'nowrap' }}>

              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: '#1E2328' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(99,102,241,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <MaterialIcons name="school" size={20} color="#818CF8" />
                </View>
                <Text style={{ color: '#ECEDEE', fontSize: 30, fontWeight: '800' }}>{totalLessons}</Text>
                <Text style={{ color: '#687076', fontSize: 12, marginTop: 4 }}>Lições concluídas</Text>
              </View>

              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: accuracy >= 80 ? '#1E2328' : 'rgba(239,68,68,0.4)' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: accuracy >= 80 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <MaterialIcons name={accuracy >= 80 ? 'check-circle' : 'trending-down'} size={20} color={accuracy >= 80 ? '#22C55E' : '#EF4444'} />
                </View>
                <Text style={{ color: accuracy >= 80 ? '#ECEDEE' : '#EF4444', fontSize: 30, fontWeight: '800' }}>{accuracy}<Text style={{ fontSize: 18, color: accuracy >= 80 ? '#687076' : '#EF4444' }}>%</Text></Text>
                <Text style={{ color: accuracy >= 80 ? '#687076' : '#EF4444', fontSize: 12, marginTop: 4 }}>Média de acertos</Text>
              </View>

              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: '#3F51B5' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Text style={{ fontSize: 26 }}>{SCORE_LEVEL_EMOJIS[scoreLevel]}</Text>
                  <View style={{ backgroundColor: '#3F51B520', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: '#818CF8', fontSize: 11, fontWeight: '700' }}>{scoreLevel}</Text>
                  </View>
                </View>
                <Text style={{ color: '#ECEDEE', fontSize: 30, fontWeight: '800' }}>{score}</Text>
                <Text style={{ color: '#687076', fontSize: 12, marginTop: 4 }}>Pontos totais</Text>
              </View>

              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: streak > 0 ? 'rgba(245,158,11,0.35)' : '#1E2328' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: streak > 0 ? 'rgba(245,158,11,0.15)' : '#1E2328', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Text style={{ fontSize: 20 }}>🔥</Text>
                </View>
                <Text style={{ color: streak > 0 ? '#FBBF24' : '#4B5563', fontSize: 30, fontWeight: '800' }}>{streak}</Text>
                <Text style={{ color: '#687076', fontSize: 12, marginTop: 4 }}>{streak === 1 ? 'Dia consecutivo' : 'Dias consecutivos'}</Text>
              </View>
            </View>

            {/* ── Progresso por categoria ── */}
            <View style={{ backgroundColor: '#0D0F10', borderRadius: 18, borderWidth: 1, borderColor: '#1E2328' }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 16 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="trending-up" size={18} color="#22C55E" />
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
              <View style={{ height: 1, backgroundColor: '#1E2328' }} />

              {/* Content */}
              {categories.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <MaterialIcons name="book" size={32} color="#4B5563" />
                  <Text style={{ color: '#687076', fontSize: 14, marginTop: 10 }}>Nenhuma lição concluída ainda.</Text>
                </View>
              ) : (
                <ScrollView
                  style={{ maxHeight: 500 }}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled>
                  <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: catGridGap, alignContent: 'flex-start', justifyContent: 'center' }}>
                  {[...categories].sort((a, b) => b.lastStudiedAt - a.lastStudiedAt).map((cat) => {
                    const acc = cat.accuracyPercent;
                    const accentColor = acc === 100 ? '#22C55E' : acc >= 80 ? '#10B981' : acc >= 50 ? '#F59E0B' : '#EF4444';
                    const trackStyle = trackStyles[cat.track] ?? TRACK_STYLE_FALLBACK;
                    return (
                      <View key={`${cat.track}__${cat.category}`} style={{
                        width: catItemWidth,
                        borderRadius: 16,
                        backgroundColor: accentColor,
                        padding: 2,
                        overflow: 'hidden',
                      }}>
                        <View style={{ backgroundColor: '#111316', borderRadius: 14, padding: 14, flex: 1 }}>
                          {/* Header: ícone + nomes + % */}
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                            <View style={{ backgroundColor: trackStyle.color + '25', borderRadius: 9, padding: 7, marginTop: 1 }}>
                              <MaterialIcons name={trackStyle.icon} size={14} color={trackStyle.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ color: '#6B7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }} numberOfLines={1}>
                                {trackLabels[cat.track] ?? cat.track}
                              </Text>
                              <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '700', marginTop: 2, lineHeight: 18 }} numberOfLines={2}>
                                {cat.category}
                              </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={{ color: accentColor, fontSize: 20, fontWeight: '800', lineHeight: 22 }}>
                                {acc}%
                              </Text>
                              <Text style={{ color: '#6B7280', fontSize: 10, marginTop: 1 }}>acertos</Text>
                            </View>
                          </View>

                          {/* Barra de progresso */}
                          <View style={{ height: 5, backgroundColor: '#1E2328', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ height: '100%', width: `${cat.studyPercent}%`, backgroundColor: accentColor, borderRadius: 4, opacity: 0.65 }} />
                          </View>

                          {/* Stats */}
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ color: '#6B7280', fontSize: 11 }}>
                              {cat.studyPercent}% estudado · {cat.uniqueQuestionsAnswered} {cat.uniqueQuestionsAnswered === 1 ? 'questão' : 'questões'}
                            </Text>
                            <Text style={{ color: '#6B7280', fontSize: 11 }}>
                              {formatDuration(cat.avgTimePerQuestionMs)}/q
                            </Text>
                          </View>

                          {cat.hasInProgressLesson && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F59E0B22', borderWidth: 1, borderColor: '#F59E0B44', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginBottom: 8 }}>
                              <MaterialIcons name="schedule" size={12} color="#F59E0B" />
                              <Text style={{ color: '#F59E0B', fontSize: 11, fontWeight: '600' }}>
                                Em andamento · {cat.inProgressAnswered} {cat.inProgressAnswered === 1 ? 'resposta' : 'respostas'}
                              </Text>
                            </View>
                          )}

                          {acc < 50 && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF444422', borderWidth: 1, borderColor: '#EF444444', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginBottom: 8 }}>
                              <MaterialIcons name="warning" size={12} color="#EF4444" />
                              <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '600' }}>Taxa baixa — revise este tema</Text>
                            </View>
                          )}

                          <Link
                            href={cat.hasInProgressLesson
                              ? `/ready/study?track=${encodeURIComponent(cat.track)}&category=${encodeURIComponent(cat.category)}`
                              : `/ready/${encodeURIComponent(cat.track)}`}
                            asChild>
                            <Pressable style={({ pressed }) => ({
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                              backgroundColor: pressed ? '#1e2a5e33' : '#1A1D21',
                              borderWidth: 1,
                              borderColor: '#3F51B580',
                              borderRadius: 10,
                              paddingVertical: 9,
                            })}>
                              <MaterialIcons name={cat.hasInProgressLesson ? 'play-arrow' : 'replay'} size={15} color="#818CF8" />
                              <Text style={{ color: '#818CF8', fontSize: 13, fontWeight: '700' }}>
                                {cat.hasInProgressLesson ? 'Continuar' : 'Estudar'}
                              </Text>
                            </Pressable>
                          </Link>
                        </View>
                      </View>
                    );
                  })}
                  </View>
                </ScrollView>
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
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            {/* Summary card */}
            <View style={{ flex: 1, backgroundColor: '#3F51B5', borderRadius: 16, padding: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Resumo geral</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginTop: 8 }}>
                {totalLessons}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
                {totalLessons === 1 ? 'lição concluída' : 'lições concluídas'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 10 }}>
                Acerto:{' '}
                <Text style={{ fontWeight: '700', color: accuracy >= 80 ? '#ffffff' : '#FCA5A5' }}>
                  {accuracy}%
                </Text>
              </Text>
            </View>

            {/* Medal card */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 2, borderColor: '#3F51B5', backgroundColor: 'rgba(63,81,181,0.05)', padding: 16 }}>
              <Text style={{ fontSize: 40 }}>{SCORE_LEVEL_EMOJIS[scoreLevel]}</Text>
              <Text style={{ color: '#3F51B5', fontSize: 16, fontWeight: '700', marginTop: 8 }}>
                {scoreLevel}
              </Text>
              <Text style={{ color: '#9BA1A6', fontSize: 13, marginTop: 4 }}>
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
