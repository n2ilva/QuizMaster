import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Text, useColorScheme, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';

import { QuizStatCard } from '@/components/quiz/stat-card';
import { SCORE_LEVEL_EMOJIS } from '@/constants/score-levels';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { fetchUserProgress, getScoreLevel, resetUserProgress, type CategoryProgress, type ScoreLevel } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

import { ProgressCategoryCard } from './components/progress-category-card';
import { ResetProgressButton } from './components/reset-progress-button';
import { CodingPracticeStore } from '../coding-practice/coding-practice.store';
import { LANGUAGES } from '../coding-practice/coding-practice.constants';

export function ProgressScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const { user } = useAuth();
  const { userProgress: cachedProgress, refreshUserProgress } = useData();
  const layoutMode = useLayoutMode();
  const { isDesktop } = useScreenSize();
  const { width: windowWidth } = useWindowDimensions();
  const categoryGridColumns = isDesktop ? (windowWidth >= 1500 ? 5 : 3) : 2;
  const categoryGridGap = 12;
  const categoryItemWidth = isDesktop
    ? (windowWidth - 344 - (categoryGridColumns - 1) * categoryGridGap) / categoryGridColumns
    : (windowWidth - 104 - (categoryGridColumns - 1) * categoryGridGap) / categoryGridColumns;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';
  const textMuted = isDark ? '#9BA1A6' : '#687076';

  const [loading, setLoading] = useState(!cachedProgress);
  const [resetting, setResetting] = useState(false);
  const [scoreLevel, setScoreLevel] = useState<ScoreLevel>(cachedProgress ? getScoreLevel(cachedProgress.totalScore) : 'Bronze');
  const [score, setScore] = useState(cachedProgress?.totalScore ?? 0);
  const [accuracy, setAccuracy] = useState(cachedProgress?.accuracyPercent ?? 0);
  const [totalLessons, setTotalLessons] = useState(cachedProgress?.totalLessons ?? 0);
  const [streak, setStreak] = useState(cachedProgress?.streak ?? 0);
  const [categories, setCategories] = useState<CategoryProgress[]>(cachedProgress?.categories ?? []);
  const [codingLangProgress, setCodingLangProgress] = useState<any[]>([]);
  const isFirstLoad = useRef(true);

  const totalCodingExercises = useMemo(() => {
    return codingLangProgress.reduce((acc, curr) => acc + (curr.completed || 0), 0);
  }, [codingLangProgress]);

  const ModernSection = ({ title, subtitle, icon, iconColor, count, children }: any) => (
    <View style={{
      backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: isDark ? '#30363D' : '#E6E8EB',
      overflow: 'hidden',
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.03,
      shadowRadius: 12,
      elevation: 2,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, paddingBottom: 12 }}>
        <View style={{ 
          width: 42, 
          height: 42, 
          borderRadius: 14, 
          backgroundColor: `${iconColor}15`, 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: textPrimary, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 }}>{title}</Text>
          <Text style={{ color: textMuted, fontSize: 13 }}>{subtitle}</Text>
        </View>
        {count && (
          <View style={{ backgroundColor: `${iconColor}15`, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: iconColor, fontSize: 12, fontWeight: '800' }}>{count}</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 16 }}>
        {children}
      </View>
    </View>
  );

  const ModernStatCard = ({ label, value, color, subtitle }: any) => (
    <View style={{
      flex: 1,
      backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? '#30363D' : '#E6E8EB',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, backgroundColor: color }} />
      <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Text>
      <View style={{ marginTop: 12 }}>
        <Text style={{ color: textPrimary, fontSize: 30, fontWeight: '900', letterSpacing: -1 }}>{value}</Text>
        {subtitle && <Text style={{ color: textMuted, fontSize: 12, marginTop: 2 }}>{subtitle}</Text>}
      </View>
    </View>
  );

  const loadProgress = useCallback(async () => {
    if (!user) return;
    
    // Always load to ensure consistency, especially for Coding Practice which isn't in global cache yet
    isFirstLoad.current = false;

    try {
      setLoading(true);
      
      // Load Quiz Progress
      const data = await fetchUserProgress(user.id);
      setAccuracy(data.accuracyPercent);
      setTotalLessons(data.totalLessons);
      setStreak(data.streak);
      setCategories(data.categories);
      setScore(data.totalScore);
      setScoreLevel(getScoreLevel(data.totalScore));

      // Load Coding Practice Progress
      const allEx = await CodingPracticeStore.getAllExercises();
      const cpProgress = await CodingPracticeStore.getProgress(user.id);
      
      const langStats = LANGUAGES.map(lang => {
        const langExercises = allEx.filter(e => e.language === lang.id);
        const completed = langExercises.filter(e => cpProgress[e.id]?.completed).length;
        return {
          id: lang.id,
          label: lang.label,
          completed,
          total: langExercises.length,
          percent: langExercises.length > 0 ? (completed / langExercises.length) * 100 : 0
        };
      });
      setCodingLangProgress(langStats);

    } catch (e) {
      console.error('Error loading progress:', e);
    } finally {
      setLoading(false);
    }
  }, [user, cachedProgress]);

  useFocusEffect(
    useCallback(() => {
      void loadProgress();
    }, [loadProgress]),
  );

  const handleReset = useCallback(() => {
    if (!user) return;

    const doReset = async () => {
      try {
        setResetting(true);
        await resetUserProgress(user.id);
        await CodingPracticeStore.resetProgress();
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
      const confirmed = window.confirm('Tem certeza? Todas as suas lições completadas e em andamento serão deletadas permanentemente.');
      if (confirmed) void doReset();
      return;
    }

    Alert.alert(
      'Resetar progresso',
      'Tem certeza? Todas as suas lições completadas e em andamento serão deletadas permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resetar', style: 'destructive', onPress: () => void doReset() },
      ],
    );
  }, [user, loadProgress, refreshUserProgress]);

  if (layoutMode === 'desktop') {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 36, paddingTop: 36, paddingBottom: bottomPadding + 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Sua evolução</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 6 }}>Acompanhe seu desempenho e identifique onde melhorar.</Text>
          </View>
          {totalLessons > 0 && <ResetProgressButton onPress={handleReset} resetting={resetting} compact />}
        </View>

        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <ActivityIndicator size="large" color="#818CF8" />
          </View>
        ) : (
          <>
                        </Text>
                      </View>
                      
                      <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                        <View style={{ height: '100%', width: `${stat.percent}%`, backgroundColor: stat.percent === 100 ? '#22C55E' : '#818CF8', borderRadius: 4 }} />
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </ModernSection>
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5 dark:bg-[#151718]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">Sua evolução</Text>
        {totalLessons > 0 && <ResetProgressButton onPress={handleReset} resetting={resetting} compact />}
      </View>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">Veja seu avanço por tema.</Text>

      {loading ? (
        <View className="mt-20 items-center">
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <>
          <View style={{ gap: 12, marginTop: 24, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <ModernStatCard label="Quiz" value={totalLessons} color={QUIZ_COLORS.primary} />
              <ModernStatCard label="Quebra-Cabeça" value={totalCodingExercises} color="#818CF8" />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <ModernStatCard label="Pontuação Geral" value={score} color="#FBBF24" />
              <ModernStatCard label="Sequência" value={streak} color="#F59E0B" />
            </View>
          </View>

          {streak > 0 && (
            <View style={{ marginBottom: 12 }} className="mt-3 flex-row items-center gap-3 rounded-2xl bg-[#F59E0B]/10 p-4">
              <Text className="text-3xl">🔥</Text>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-[#D97706] dark:text-[#FBBF24]">
                  {streak} {streak === 1 ? 'dia' : 'dias'} consecutivos
                </Text>
                <Text className="mt-0.5 text-xs text-[#B45309] dark:text-[#FCD34D]">Continue estudando para manter sua sequência!</Text>
              </View>
            </View>
          )}

          <ModernSection 
            title="Progresso Quiz" 
            subtitle="Categorias estudadas" 
            icon="quiz" 
            iconColor="#22C55E"
            count={categories.length > 0 ? categories.length : null}
          >
            {categories.length === 0 ? (
              <View style={{ padding: 12 }}>
                <Text style={{ color: textMuted, textAlign: 'center' }}>Conclua lições para exibir progresso.</Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {[...categories].sort((a, b) => b.lastStudiedAt - a.lastStudiedAt).map((category, index) => (
                  <View key={`${category.track}__${category.category}`}>
                    {index > 0 && <View style={{ height: 1, backgroundColor: isDark ? '#30363D' : '#F1F5F9', marginBottom: 12, opacity: 0.5 }} />}
                    <ProgressCategoryCard categoryProgress={category} />
                  </View>
                ))}
              </View>
            )}
          </ModernSection>

          <ModernSection 
            title="Progresso Quebra-Cabeça" 
            subtitle="Prática por linguagem" 
            icon="extension" 
            iconColor="#818CF8"
            count={codingLangProgress.some(s => s.completed > 0) ? `${codingLangProgress.filter(s => s.completed > 0).length} / ${codingLangProgress.length}` : null}
          >
            <View style={{ gap: 16 }}>
              {codingLangProgress.filter(s => s.completed > 0).length === 0 ? (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Text style={{ color: textMuted, fontSize: 13 }}>Nenhum exercício concluído ainda.</Text>
                </View>
              ) : (
                codingLangProgress.filter(s => s.completed > 0).map((stat, idx) => (
                  <Pressable 
                    key={stat.id} 
                    onPress={() => router.push(`/coding-practice?lang=${stat.id}`)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    {idx > 0 && <View style={{ height: 1, backgroundColor: isDark ? '#30363D' : '#F1F5F9', marginBottom: 16 }} />}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                        <MaterialIcons name="extension" size={14} color={stat.percent === 100 ? "#22C55E" : "#818CF8"} />
                        <Text style={{ fontWeight: '700', color: textPrimary }}>{stat.label}</Text>
                      </View>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: textPrimary }}>{Math.round(stat.percent)}%</Text>
                    </View>
                    <View style={{ height: 8, width: '100%', borderRadius: 4, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', overflow: 'hidden' }}>
                      <View 
                        style={{ height: '100%', width: `${stat.percent}%`, backgroundColor: stat.percent === 100 ? '#22C55E' : '#818CF8' }} 
                      />
                    </View>
                    <Text style={{ marginTop: 6, fontSize: 11, color: textMuted }}>
                      {stat.completed} de {stat.total} exercícios concluídos
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          </ModernSection>
        </>
      )}
    </ScrollView>
  );
}
