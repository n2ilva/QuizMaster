import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Text, useColorScheme, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';

import { SCORE_LEVEL_EMOJIS } from '@/constants/score-levels';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { fetchUserProgress, getScoreLevel, resetUserProgress, type CategoryProgress, type ScoreLevel, fetchDataCenterProgress, fetchQuickResponseProgress } from '@/lib/api';
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
  const { userProgress: cachedProgress, refreshUserProgress, dbStats: stats, trackCatalog } = useData();
  const layoutMode = useLayoutMode();
  const { isDesktop } = useScreenSize();
  const { width: windowWidth } = useWindowDimensions();
  const categoryGridColumns = layoutMode === 'desktop' ? (windowWidth >= 1500 ? 5 : 3) : 2;
  const categoryGridGap = 12;
  const categoryItemWidth = layoutMode === 'desktop'
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
  const [incidentsStats, setIncidentsStats] = useState({ completed: 0, total: 0, slaRate: 0 });
  const [dcStats, setDcStats] = useState({ completed: 0, total: 0, avgTime: 0, avgMoves: 0, avgScore: 0 });
  const [codingStats, setCodingStats] = useState({ completed: 0, total: 0, avgTime: 0, avgMoves: 0 });
  const [quizStats, setQuizStats] = useState({ mastered: 0, total: 0, accuracy: 0, avgTime: 0 });
  const isFirstLoad = useRef(true);

  const totalCodingExercises = useMemo(() => {
    return codingLangProgress.reduce((acc, curr) => acc + (curr.completed || 0), 0);
  }, [codingLangProgress]);

  const ModernSection = ({ title, subtitle, icon, iconColor, count, children, style }: any) => (
    <View style={[{
      backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: isDark ? '#30363D' : '#E6E8EB',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.03,
      shadowRadius: 12,
      elevation: 2,
    }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, paddingBottom: 12 }}>
        <View style={{ 
          width: 42, 
          height: 42, 
          borderRadius: 14, 
          backgroundColor: `${iconColor}15`, 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <MaterialCommunityIcons name={icon as any} size={22} color={iconColor} />
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

  const InnerStatCard = ({ label, value, icon, color }: any) => (
    <View style={{ 
      backgroundColor: isDark ? '#2D3139' : '#F8FAFC', 
      padding: 12, 
      borderRadius: 16, 
      flex: 1, 
      minWidth: '45%',
      borderWidth: 1, 
      borderColor: isDark ? '#3D444D' : '#E2E8F0'
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <MaterialCommunityIcons name={icon} size={14} color={color} />
        <Text style={{ color: textMuted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Text>
      </View>
      <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '900' }}>{value}</Text>
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

      // 2. Outros jogos
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
      
      const finishedCoding = Object.values(cpProgress).filter((p: any) => p.completed);
      setCodingStats({
        completed: finishedCoding.length,
        total: allEx.length,
        avgTime: finishedCoding.length > 0 
          ? Math.round(finishedCoding.reduce((acc: any, curr: any) => acc + curr.bestTime, 0) / finishedCoding.length)
          : 0,
        avgMoves: finishedCoding.length > 0
          ? Math.round(finishedCoding.reduce((acc: any, curr: any) => acc + (curr.bestMoves || 0), 0) / finishedCoding.length)
          : 0
      });

      // 3. Incidentes & Data Center (Centralizado no API)
      setIncidentsStats({ 
        completed: data.extraStats?.incidents.completed ?? 0, 
        total: data.extraStats?.incidents.total ?? 0, 
        slaRate: data.extraStats?.incidents.slaRate ?? 0
      });

      setDcStats({ 
        completed: data.extraStats?.datacenter.completed ?? 0, 
        total: data.extraStats?.datacenter.total ?? 0,
        avgTime: data.extraStats?.datacenter.avgTime ?? 0,
        avgMoves: data.extraStats?.datacenter.avgMoves ?? 0,
        avgScore: data.extraStats?.datacenter.avgScore ?? 0
      });

      // 5. Quiz Summary
      const catalogTotal = (trackCatalog || []).reduce((acc, t) => acc + (t.totalCards || 0), 0);
      const qTotal = stats?.totalCards || catalogTotal || (data.categories || []).reduce((acc, c: any) => acc + (c.totalCards || 0), 0);
      
      const qMastered = (data.categories || []).reduce((acc, c) => acc + (c.uniqueQuestionsAnswered || 0), 0);
      setQuizStats({ 
        mastered: qMastered, 
        total: qTotal, 
        accuracy: qTotal > 0 ? (qMastered / qTotal) * 100 : 0,
        avgTime: data.avgTimeMs ? data.avgTimeMs / 1000 : 0
      });
    } catch (e) {
      console.error('Error loading progress:', e);
    } finally {
      setLoading(false);
    }
  }, [user, stats, trackCatalog]);

  useEffect(() => {
    if (!isFirstLoad.current && (stats || trackCatalog.length > 0)) {
      void loadProgress();
    }
  }, [stats, trackCatalog, loadProgress]);

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
          <View style={{ gap: 24 }}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <ModernStatCard label="Pontuação Total" value={score} subtitle={`${scoreLevel} Ranking`} color="#FBBF24" />
              <ModernStatCard label="Sequência 🔥" value={streak} subtitle="Dias consecutivos" color="#F59E0B" />
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {/* QUIZ */}
              <View style={{ width: layoutMode === 'desktop' ? '49%' : '100%' }}>
                <ModernSection title="Quiz" subtitle="Consistência teórica" icon="school" iconColor="#38BDF8" count={`${quizStats.mastered}/${quizStats.total}`}>
                  <View style={{ gap: 12 }}>
                    <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${quizStats.total > 0 ? (quizStats.mastered / quizStats.total) * 100 : 0}%`, backgroundColor: '#38BDF8' }} />
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      <InnerStatCard label="Taxa Domínio" value={`${Math.round(quizStats.accuracy)}%`} icon="brain" color="#38BDF8" />
                      <InnerStatCard label="Taxa Acerto" value={`${Math.round((quizStats.mastered / (quizStats.total || 1)) * 100)}%`} icon="bullseye-arrow" color="#38BDF8" />
                      <InnerStatCard label="Tempo Questão" value={`${quizStats.avgTime.toFixed(1)}s`} icon="clock-fast" color="#38BDF8" />
                      <InnerStatCard label="Quantidade de Quiz" value={quizStats.mastered} icon="book-open-variant" color="#38BDF8" />
                    </View>
                  </View>
                </ModernSection>
              </View>

              {/* CODING */}
              <View style={{ width: layoutMode === 'desktop' ? '49%' : '100%' }}>
                <ModernSection title="Prática de Código" subtitle="Linguagens e Lógica" icon="terminal-box" iconColor="#10B981" count={`${codingStats.completed}/${codingStats.total}`}>
                  <View style={{ gap: 12 }}>
                    <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${codingStats.total > 0 ? (codingStats.completed / codingStats.total) * 100 : 0}%`, backgroundColor: '#10B981' }} />
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      <InnerStatCard label="Tempo Médio" value={`${codingStats.avgTime}s`} icon="timer-outline" color="#10B981" />
                      <InnerStatCard label="Média Linhas" value={codingStats.avgMoves} icon="code-braces" color="#10B981" />
                      <InnerStatCard label="Conclusão" value={`${Math.round((codingStats.completed / (codingStats.total || 1)) * 100)}%`} icon="progress-check" color="#10B981" />
                      <InnerStatCard label="Linguagens" value={codingLangProgress.filter(l => l.completed > 0).length} icon="translate" color="#10B981" />
                    </View>
                  </View>
                </ModernSection>
              </View>

              {/* INCIDENTS */}
              <View style={{ width: layoutMode === 'desktop' ? '49%' : '100%' }}>
                <ModernSection title="Gestão de Incidentes" subtitle="Suporte de Nível 3" icon="shield-check" iconColor="#F43F5E" count={`${incidentsStats.completed}/${incidentsStats.total}`}>
                  <View style={{ gap: 12 }}>
                    <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${incidentsStats.total > 0 ? (incidentsStats.completed / incidentsStats.total) * 100 : 0}%`, backgroundColor: '#F43F5E' }} />
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      <InnerStatCard label="SLA OK Rate" value={`${Math.round(incidentsStats.slaRate)}%`} icon="TimerCheck" color="#F43F5E" />
                      <InnerStatCard label="Qualidade" value={incidentsStats.slaRate > 80 ? 'EXCELENTE' : 'SÉNIOR'} icon="professional-hexagon" color="#F43F5E" />
                      <InnerStatCard label="Resolvidos" value={incidentsStats.completed} icon="check-all" color="#F43F5E" />
                      <InnerStatCard label="Meta SLA" value="> 90%" icon="target" color="#F43F5E" />
                    </View>
                  </View>
                </ModernSection>
              </View>

              {/* DATA CENTER */}
              <View style={{ width: layoutMode === 'desktop' ? '49%' : '100%' }}>
                <ModernSection title="Data Center Builder" subtitle="Física e Estrutura" icon="server-network" iconColor="#8B5CF6" count={`${dcStats.completed}/${dcStats.total}`}>
                  <View style={{ gap: 12 }}>
                    <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${dcStats.total > 0 ? (dcStats.completed / dcStats.total) * 100 : 0}%`, backgroundColor: '#8B5CF6' }} />
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      <InnerStatCard label="Qualidade Técnica" value={`${Math.round(dcStats.avgScore)}%`} icon="verified" color="#8B5CF6" />
                      <InnerStatCard label="Eficiência Tempo" value={`${Math.round(dcStats.avgTime)}s`} icon="timer-outline" color="#8B5CF6" />
                      <InnerStatCard label="Média Movimentos" value={dcStats.avgMoves} icon="gesture-tap" color="#8B5CF6" />
                      <InnerStatCard label="Disponibilidade" value="99.9%" icon="arrow-up-bold-circle-outline" color="#22C55E" />
                    </View>
                  </View>
                </ModernSection>
              </View>
            </View>
          </View>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
          <ActivityIndicator size="large" color="#818CF8" />
        </View>
      ) : (
        <View style={{ gap: 16, marginTop: 16, paddingBottom: 40 }}>
          {/* Dashboard Mobile */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <ModernStatCard label="Pontos" value={score} color="#FBBF24" />
            <ModernStatCard label="🔥 Dias" value={streak} color="#F59E0B" />
          </View>

          {/* QUIZ */}
          <ModernSection title="Quiz" icon="school" iconColor="#38BDF8" count={`${quizStats.mastered}/${quizStats.total}`}>
            <View style={{ gap: 10 }}>
              <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${quizStats.total > 0 ? (quizStats.mastered / quizStats.total) * 100 : 0}%`, backgroundColor: '#38BDF8' }} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <InnerStatCard label="Domínio" value={`${Math.round(quizStats.accuracy)}%`} icon="brain" color="#38BDF8" />
                <InnerStatCard label="Acerto" value={`${Math.round((quizStats.mastered / (quizStats.total || 1)) * 100)}%`} icon="bullseye-arrow" color="#38BDF8" />
                <InnerStatCard label="Tempo" value={`${quizStats.avgTime.toFixed(1)}s`} icon="clock-fast" color="#38BDF8" />
                <InnerStatCard label="Qtde de Quiz" value={quizStats.mastered} icon="book-open-variant" color="#38BDF8" />
              </View>
            </View>
          </ModernSection>

          {/* CODING */}
          <ModernSection title="Prática de Código" icon="terminal-box" iconColor="#10B981" count={`${codingStats.completed}/${codingStats.total}`}>
            <View style={{ gap: 10 }}>
              <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${codingStats.total > 0 ? (codingStats.completed / codingStats.total) * 100 : 0}%`, backgroundColor: '#10B981' }} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <InnerStatCard label="T. Médio" value={`${codingStats.avgTime}s`} icon="timer-outline" color="#10B981" />
                <InnerStatCard label="Eficiência" value={`${Math.round((codingStats.completed / (codingStats.total || 1)) * 100)}%`} icon="bullseye" color="#10B981" />
                <InnerStatCard label="Movimentos" value={codingStats.avgMoves} icon="code-braces" color="#10B981" />
                <InnerStatCard label="Linguagens" value={codingLangProgress.filter(l => l.completed > 0).length} icon="translate" color="#10B981" />
              </View>
            </View>
          </ModernSection>

          {/* INCIDENTS */}
          <ModernSection title="Gestão de Incidentes" icon="shield-check" iconColor="#F43F5E" count={`${incidentsStats.completed}/${incidentsStats.total}`}>
            <View style={{ gap: 10 }}>
              <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${incidentsStats.total > 0 ? (incidentsStats.completed / incidentsStats.total) * 100 : 0}%`, backgroundColor: '#F43F5E' }} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <InnerStatCard label="SLA OK" value={`${Math.round(incidentsStats.slaRate)}%`} icon="TimerCheck" color="#F43F5E" />
                <InnerStatCard label="Qualidade" value={incidentsStats.slaRate > 80 ? 'EXCELENTE' : 'SÉNIOR'} icon="professional-hexagon" color="#F43F5E" />
                <InnerStatCard label="Resolvidos" value={incidentsStats.completed} icon="check-all" color="#F43F5E" />
                <InnerStatCard label="SLA Alvo" value="90%" icon="bullseye" color="#F43F5E" />
              </View>
            </View>
          </ModernSection>

          {/* DATA CENTER */}
          <ModernSection title="Data Center Builder" icon="server-network" iconColor="#8B5CF6" count={`${dcStats.completed}/${dcStats.total}`}>
            <View style={{ gap: 10 }}>
              <View style={{ height: 6, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${dcStats.total > 0 ? (dcStats.completed / dcStats.total) * 100 : 0}%`, backgroundColor: '#8B5CF6' }} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <InnerStatCard label="Qualidade" value={`${Math.round(dcStats.avgScore)}%`} icon="verified" color="#8B5CF6" />
                <InnerStatCard label="Eficiência" value={`${Math.round(dcStats.avgTime)}s`} icon="timer-outline" color="#8B5CF6" />
                <InnerStatCard label="Movimentos" value={dcStats.avgMoves} icon="gesture-tap" color="#8B5CF6" />
                <InnerStatCard label="Uptime" value="99.9%" icon="arrow-up-bold-circle-outline" color="#8B5CF6" />
              </View>
            </View>
          </ModernSection>
        </View>
      )}
    </ScrollView>
  );
}
