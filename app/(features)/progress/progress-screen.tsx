import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Text, useColorScheme, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';

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
    isFirstLoad.current = false;

    try {
      setLoading(true);
      const data = await fetchUserProgress(user.id);
      setTotalLessons(data.totalLessons);
      setStreak(data.streak);
      setCategories(data.categories);
      setScore(data.totalScore);
      setScoreLevel(getScoreLevel(data.totalScore));

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
  }, [user]);

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
        if (Platform.OS === 'web') alert('Progresso resetado!');
        else Alert.alert('Sucesso', 'Progresso resetado!');
      } catch (error) {
        console.error('Reset error:', error);
      } finally {
        setResetting(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza?')) void doReset();
    } else {
      Alert.alert('Resetar', 'Tem certeza?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resetar', style: 'destructive', onPress: () => void doReset() },
      ]);
    }
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
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
              <ModernStatCard label="Quiz" value={totalLessons} subtitle="Concluídos" color={QUIZ_COLORS.primary} />
              <ModernStatCard label="Quebra-Cabeça" value={totalCodingExercises} subtitle="Feitos" color="#818CF8" />
              <ModernStatCard label="Pontuação" value={score} subtitle={`${scoreLevel} Ranking`} color="#FBBF24" />
              <ModernStatCard label="Sequência" value={streak} subtitle="Dias" color="#F59E0B" />
            </View>

            <ModernSection title="Progresso Quiz" subtitle="Categorias concluídas" icon="quiz" iconColor="#22C55E" count={categories.length}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: categoryGridGap }}>
                {categories.map((c) => (
                  <View key={`${c.track}_${c.category}`} style={{ width: categoryItemWidth }}>
                    <ProgressCategoryCard categoryProgress={c} />
                  </View>
                ))}
              </View>
            </ModernSection>

            <ModernSection title="Progresso Quebra-Cabeça" subtitle="Por linguagem" icon="extension" iconColor="#818CF8">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {codingLangProgress.filter(s => s.completed > 0).map((stat) => (
                  <Pressable key={stat.id} style={{ width: categoryItemWidth, backgroundColor: isDark ? '#1C1F24' : '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: isDark ? '#30363D' : '#E2E8F0' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <MaterialIcons name="extension" size={16} color={stat.percent === 100 ? "#22C55E" : "#818CF8"} />
                      <Text style={{ color: textPrimary, fontSize: 14, fontWeight: '800', flex: 1 }}>{stat.label}</Text>
                      <Text style={{ color: textPrimary, fontWeight: '900' }}>{Math.round(stat.percent)}%</Text>
                    </View>
                    <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${stat.percent}%`, backgroundColor: stat.percent === 100 ? '#22C55E' : '#818CF8' }} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </ModernSection>
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#151718' : '#FFFFFF' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding, paddingHorizontal: 20 }}>
      {/* Mobile view content */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: textPrimary }}>Sua evolução</Text>
        {totalLessons > 0 && <ResetProgressButton onPress={handleReset} resetting={resetting} compact />}
      </View>
      
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#818CF8" />
      ) : (
        <>
          <View style={{ gap: 12, marginTop: 24 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <ModernStatCard label="Quiz" value={totalLessons} color={QUIZ_COLORS.primary} />
              <ModernStatCard label="Código" value={totalCodingExercises} color="#818CF8" />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <ModernStatCard label="Pontos" value={score} color="#FBBF24" />
              <ModernStatCard label="🔥 Dias" value={streak} color="#F59E0B" />
            </View>
          </View>

          <ModernSection title="Progresso Quiz" icon="quiz" iconColor="#22C55E" style={{ marginTop: 24 }}>
            {categories.map((c, i) => (
              <View key={c.category}>
                {i > 0 && <View style={{ height: 1, backgroundColor: isDark ? '#30363D' : '#F1F5F9', marginVertical: 12 }} />}
                <ProgressCategoryCard categoryProgress={c} />
              </View>
            ))}
          </ModernSection>

          <ModernSection title="Quebra-Cabeça" icon="extension" iconColor="#818CF8">
            {codingLangProgress.filter(s => s.completed > 0).map((s, i) => (
              <View key={s.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: textPrimary, fontWeight: '700' }}>{s.label}</Text>
                  <Text style={{ color: textPrimary }}>{Math.round(s.percent)}%</Text>
                </View>
                <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${s.percent}%`, backgroundColor: '#818CF8' }} />
                </View>
              </View>
            ))}
          </ModernSection>
        </>
      )}
    </ScrollView>
  );
}
