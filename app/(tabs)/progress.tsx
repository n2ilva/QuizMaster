import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { trackLabels } from '@/data/tracks';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useTabContentPadding } from '@/hooks/use-tab-content-padding';
import {
    type CategoryProgress,
    fetchUserProgress,
    formatDuration,
    getScoreLevel,
    getWeakestSubjects,
    resetUserProgress,
    type ScoreLevel,
    type WeakestSubject,
} from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

const scoreLevelEmojis: Record<ScoreLevel, string> = {
  Bronze: '🥉',
  Prata: '🥈',
  Ouro: '🥇',
  Diamante: '💎',
};

const scoreLevelNames: Record<ScoreLevel, string> = {
  Bronze: 'Bronze',
  Prata: 'Prata',
  Ouro: 'Ouro',
  Diamante: 'Diamante',
};

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
        <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">
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

      {/* Study progress bar */}
      <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E6E8EB] dark:bg-[#2A2F36]">
        <View
          className="h-full rounded-full"
          style={{
            width: `${cat.studyPercent}%`,
            backgroundColor: '#3F51B5',
          }}
        />
      </View>

      {/* Action button */}
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
  const [avgTime, setAvgTime] = useState(cachedProgress?.avgTimeMs ?? 0);
  const [totalLessons, setTotalLessons] = useState(cachedProgress?.totalLessons ?? 0);
  const [streak, setStreak] = useState(cachedProgress?.streak ?? 0);
  const [categories, setCategories] = useState<CategoryProgress[]>(cachedProgress?.categories ?? []);
  const [weakSubjects, setWeakSubjects] = useState<WeakestSubject[]>([]);
  const isFirstLoad = useRef(true);

  const loadProgress = useCallback(async () => {
    if (!user) return;
    // Skip the first fetch if we already have cached data
    if (isFirstLoad.current && cachedProgress) {
      isFirstLoad.current = false;
      // Mesmo com cache, busca pontos fracos diretamente do Firestore
      try {
        const weak = await getWeakestSubjects(user.id, 5);
        setWeakSubjects(weak);
      } catch {
        // silently fail
      }
      return;
    }
    isFirstLoad.current = false;
    try {
      setLoading(true);
      const data = await fetchUserProgress(user.id);
      setAccuracy(data.accuracyPercent);
      setAvgTime(data.avgTimeMs);
      setTotalLessons(data.totalLessons);
      setStreak(data.streak);
      setCategories(data.categories);
      
      // Usa o score calculado por fetchUserProgress
      setScore(data.totalScore);
      setScoreLevel(getScoreLevel(data.totalScore));

      // Busca assuntos mais fracos
      const weak = await getWeakestSubjects(user.id, 5);
      setWeakSubjects(weak);
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
  }, [user, loadProgress]);

  if (isDesktop) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 36, paddingBottom: bottomPadding + 24 }}>

        {/* ── Cabeçalho ── */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#ECEDEE', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Sua evolução</Text>
          <Text style={{ color: '#687076', fontSize: 14, marginTop: 6 }}>Acompanhe seu desempenho e identifique onde melhorar.</Text>
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
              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: '#1E2328' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <MaterialIcons name="check-circle" size={20} color="#22C55E" />
                </View>
                <Text style={{ color: '#ECEDEE', fontSize: 30, fontWeight: '800' }}>{accuracy}<Text style={{ fontSize: 18, color: '#687076' }}>%</Text></Text>
                <Text style={{ color: '#687076', fontSize: 12, marginTop: 4 }}>Média de acertos</Text>
              </View>

              {/* Pontuação / nível */}
              <View style={{ flex: 1, borderRadius: 18, padding: 22, backgroundColor: '#0D0F10', borderWidth: 1, borderColor: '#3F51B5' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Text style={{ fontSize: 26 }}>{scoreLevelEmojis[scoreLevel]}</Text>
                  <View style={{ backgroundColor: '#3F51B520', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: '#818CF8', fontSize: 11, fontWeight: '700' }}>{scoreLevelNames[scoreLevel]}</Text>
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

            {/* ── Layout de 2 colunas ── */}
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'flex-start' }}>

              {/* Coluna esquerda — Pontos fracos */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="trending-down" size={17} color="#EF4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ECEDEE', fontSize: 16, fontWeight: '700' }}>Pontos fracos</Text>
                    <Text style={{ color: '#687076', fontSize: 12 }}>Categorias com menor acerto</Text>
                  </View>
                  {weakSubjects.length > 0 && (
                    <View style={{ backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '700' }}>{weakSubjects.length}</Text>
                    </View>
                  )}
                </View>

                {weakSubjects.length === 0 ? (
                  <View style={{ backgroundColor: '#0D0F10', borderRadius: 16, borderWidth: 1, borderColor: '#1E2328', padding: 32, alignItems: 'center' }}>
                    <MaterialIcons name="emoji-events" size={32} color="#22C55E" />
                    <Text style={{ color: '#22C55E', fontSize: 14, fontWeight: '600', marginTop: 10 }}>Nenhum ponto fraco!</Text>
                    <Text style={{ color: '#687076', fontSize: 12, marginTop: 4, textAlign: 'center' }}>Continue estudando para monitorar seu desempenho.</Text>
                  </View>
                ) : (
                  <View style={{ backgroundColor: '#0D0F10', borderRadius: 16, borderWidth: 1, borderColor: '#1E2328', overflow: 'hidden', height: 480 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 15 }}>
                    {weakSubjects.map((subject, index) => {
                      const barColor = subject.accuracy >= 60 ? '#F59E0B' : '#EF4444';
                      const isLast = index === weakSubjects.length - 1;
                      return (
                        <Link key={`${subject.track}__${subject.category}`} href={`/ready/study?track=${encodeURIComponent(subject.track)}&category=${encodeURIComponent(subject.category)}`} asChild>
                          <Pressable style={({ pressed }) => ({
                            padding: 16,
                            backgroundColor: pressed ? '#13151a' : 'transparent',
                            borderBottomWidth: isLast ? 0 : 1,
                            borderBottomColor: '#1E2328',
                          })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${barColor}20`, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: barColor, fontSize: 11, fontWeight: '800' }}>{index + 1}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={{ color: '#ECEDEE', fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{subject.category}</Text>
                                <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                                  {subject.totalWrong} erro{subject.totalWrong !== 1 ? 's' : ''} · {subject.uniqueCards} cards
                                </Text>
                              </View>
                              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                <Text style={{ color: barColor, fontSize: 16, fontWeight: '800' }}>{subject.accuracy}%</Text>
                              </View>
                            </View>
                            <View style={{ marginTop: 10, height: 4, backgroundColor: '#1E2328', borderRadius: 4, overflow: 'hidden' }}>
                              <View style={{ height: '100%', width: `${subject.accuracy}%`, backgroundColor: barColor, borderRadius: 4 }} />
                            </View>
                          </Pressable>
                        </Link>
                      );
                    })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Coluna direita — Progresso por categoria */}
              <View style={{ flex: 1 }}>
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
                  <View style={{ backgroundColor: '#0D0F10', borderRadius: 16, borderWidth: 1, borderColor: '#1E2328', overflow: 'hidden', height: 480 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 15 }}>
                    {categories.map((cat, index) => {
                      const isLast = index === categories.length - 1;
                      const statusColor = cat.accuracyPercent >= 80 ? '#22C55E' : cat.accuracyPercent >= 50 ? '#F59E0B' : '#EF4444';
                      return (
                        <Link
                          key={`${cat.track}__${cat.category}`}
                          href={cat.hasInProgressLesson
                            ? `/ready/study?track=${encodeURIComponent(cat.track)}&category=${encodeURIComponent(cat.category)}`
                            : `/ready/${encodeURIComponent(cat.track)}`}
                          asChild>
                          <Pressable style={({ pressed }) => ({
                            padding: 16,
                            backgroundColor: pressed ? '#13151a' : 'transparent',
                            borderBottomWidth: isLast ? 0 : 1,
                            borderBottomColor: '#1E2328',
                          })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                              <View style={{ width: 6, height: 36, borderRadius: 3, backgroundColor: statusColor }} />
                              <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                  <Text style={{ color: '#ECEDEE', fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{cat.category}</Text>
                                  {cat.hasInProgressLesson && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                                      <MaterialIcons name="play-arrow" size={11} color="#F59E0B" />
                                      <Text style={{ color: '#F59E0B', fontSize: 10, fontWeight: '600' }}>Em andamento</Text>
                                    </View>
                                  )}
                                </View>
                                <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                                  {trackLabels[cat.track] ?? cat.track} · {formatDuration(cat.avgTimePerQuestionMs)}/questão
                                </Text>
                                <View style={{ marginTop: 8, height: 3, backgroundColor: '#1E2328', borderRadius: 3, overflow: 'hidden' }}>
                                  <View style={{ height: '100%', width: `${cat.studyPercent}%`, backgroundColor: '#818CF8', borderRadius: 3 }} />
                                </View>
                              </View>
                              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                <Text style={{ color: statusColor, fontSize: 15, fontWeight: '800' }}>{cat.accuracyPercent}%</Text>
                                <Text style={{ color: '#6B7280', fontSize: 10 }}>{cat.studyPercent}% visto</Text>
                              </View>
                            </View>
                          </Pressable>
                        </Link>
                      );
                    })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* ── Botão de reset ── */}
            {totalLessons > 0 && (
              <Pressable
                onPress={handleReset}
                disabled={resetting}
                style={({ pressed }) => ({
                  marginTop: 28,
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'rgba(239,68,68,0.4)',
                  backgroundColor: pressed ? 'rgba(239,68,68,0.12)' : 'transparent',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                })}>
                <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
                <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600' }}>
                  {resetting ? 'Resetando...' : 'Resetar progresso'}
                </Text>
              </Pressable>
            )}
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
      <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">Sua evolução</Text>
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
      <View className="mt-5 flex-row gap-3">
        {/* Summary card */}
        <View className="flex-1 rounded-2xl bg-[#3F51B5] p-4">
          <Text className="text-sm text-white/80">Resumo geral</Text>
          <Text className="mt-2 text-3xl font-bold text-white">
            {totalLessons}
          </Text>
          <Text className="mt-1 text-sm text-white/70">
            {totalLessons === 1 ? 'lição concluída' : 'lições concluídas'}
          </Text>
          <Text className="mt-3 text-sm text-white/70">
            Média de acerto: <Text className="font-semibold text-white">{accuracy}%</Text>
          </Text>
        </View>

        {/* Medal card */}
        <View className="flex-1 items-center justify-center rounded-2xl border-2 border-[#3F51B5] bg-[#3F51B5]/5 p-4">
          <Text className="text-5xl">{scoreLevelEmojis[scoreLevel]}</Text>
          <Text className="mt-2 text-lg font-bold text-[#3F51B5]">
            {scoreLevelNames[scoreLevel]}
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

      {/* Weak subjects card */}
      {weakSubjects.length > 0 && (
        <View className="mt-5 overflow-hidden rounded-2xl border border-[#EF4444]/20 dark:border-[#EF4444]/30">
          {/* Header */}
          <View style={{ backgroundColor: 'rgba(239,68,68,0.08)' }} className="flex-row items-center gap-3 px-4 py-3">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EF4444]/15">
              <MaterialIcons name="trending-down" size={20} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#EF4444]">
                Pontos fracos
              </Text>
              <Text className="text-[11px] text-[#B45309] dark:text-[#9BA1A6]">
                Foque nestas categorias para evoluir mais rápido
              </Text>
            </View>
            <View className="rounded-full bg-[#EF4444]/15 px-2 py-0.5">
              <Text className="text-[10px] font-bold text-[#EF4444]">{weakSubjects.length}</Text>
            </View>
          </View>

          {/* List */}
          <ScrollView
            style={{ maxHeight: 320 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={{ padding: 12, gap: 10 }}>
            {weakSubjects.map((subject, index) => {
              const barColor = subject.accuracy >= 60 ? '#F59E0B' : '#EF4444';
              return (
                <Link
                  key={`${subject.track}__${subject.category}`}
                  href={`/ready/study?track=${encodeURIComponent(subject.track)}&category=${encodeURIComponent(subject.category)}`}
                  asChild>
                  <Pressable className="rounded-xl border border-[#EF4444]/15 bg-[#FEF2F2] p-3 active:opacity-70 dark:border-[#EF4444]/20 dark:bg-[#1A1215]">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 flex-row items-center gap-2">
                        <View className="h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: `${barColor}20` }}>
                          <Text className="text-[10px] font-bold" style={{ color: barColor }}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text className="flex-1 text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]" numberOfLines={1}>
                          {subject.category}
                        </Text>
                      </View>
                      <Text className="text-sm font-bold" style={{ color: barColor }}>
                        {subject.accuracy}%
                      </Text>
                    </View>
                    <View className="mt-2 flex-row items-center gap-3">
                      <View className="flex-1">
                        <View className="h-1.5 w-full overflow-hidden rounded-full bg-[#EF4444]/10 dark:bg-[#2A2F36]">
                          <View
                            className="h-full rounded-full"
                            style={{ width: `${subject.accuracy}%`, backgroundColor: barColor }}
                          />
                        </View>
                      </View>
                      <Text className="text-[10px] text-[#687076] dark:text-[#9BA1A6]">
                        {subject.totalWrong} erro{subject.totalWrong !== 1 ? 's' : ''} · {subject.uniqueCards} cards
                      </Text>
                    </View>
                  </Pressable>
                </Link>
              );
            })}
          </ScrollView>
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
            contentContainerStyle={{ padding: 12, gap: 10 }}>
            {categories.map((cat) => (
              <CategoryCard key={`${cat.track}__${cat.category}`} cat={cat} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Reset button */}
      {totalLessons > 0 && (
        <Pressable
          onPress={handleReset}
          disabled={resetting}
          className="mt-6 mb-4 rounded-lg border border-[#EF4444] bg-[#EF4444]/10 px-4 py-3 hover:bg-[#EF4444]/20 active:opacity-70">
          <Text className="text-center text-sm font-semibold text-[#EF4444]">
            {resetting ? 'Resetando...' : 'Resetar progresso'}
          </Text>
        </Pressable>
      )}
        </>
      )}
    </ScrollView>
  );
}
