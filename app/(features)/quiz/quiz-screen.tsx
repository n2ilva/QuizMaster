import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { QuizActionButton } from '@/components/quiz/action-button';
import { TRACK_STYLE_FALLBACK, trackStyles } from '@/constants/track-styles';
import { getLanguageStudyPlan, getStudyPlan, type StudyLevel } from '@/data/study-plans';
import { useStudyPlans } from '@/hooks/use-last-study-plan';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

import { QuizTrackCard, type QuizTrackItem } from './components/quiz-track-card';
import { SavedPlansDropdown } from './components/saved-plans-dropdown';

export function QuizScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const { trackCatalog, userProgress } = useData();
  const layoutMode = useLayoutMode();
  const router = useRouter();
  const { user } = useAuth();
  const { plans: savedPlans, removePlan, refresh } = useStudyPlans(user?.id);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const anchorRef = useRef<View>(null);
  const tracks: QuizTrackItem[] = trackCatalog.map((item) => {
    const style = trackStyles[item.key] ?? TRACK_STYLE_FALLBACK;
    return {
      key: item.key,
      label: item.label,
      icon: style.icon,
      color: style.color,
    };
  });

  const progressByCategory = useMemo(() => {
    const progressMap = new Map<string, number>();
    for (const category of userProgress?.categories ?? []) {
      progressMap.set(`${category.track}__${category.category}`, category.studyPercent);
    }
    return progressMap;
  }, [userProgress]);

  const plansWithProgress = useMemo(() => {
    return savedPlans.map((plan) => {
      const studyPlan = plan.language
        ? getLanguageStudyPlan(plan.language, plan.level as StudyLevel)
        : getStudyPlan(plan.track, plan.level as StudyLevel);

      const sequence = studyPlan?.sequence ?? [];
      const totalTopics = sequence.length;
      const progressValues = sequence.map((category) => progressByCategory.get(`${plan.track}__${category}`) ?? 0);
      const progressPercent = totalTopics > 0 ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / totalTopics) : 0;
      const completedTopics = progressValues.filter((value) => value >= 100).length;

      return {
        ...plan,
        progressPercent,
        completedTopics,
        totalTopics,
      };
    });
  }, [progressByCategory, savedPlans]);

  if (layoutMode === 'desktop') {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 32, paddingTop: 32, paddingBottom: bottomPadding }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12 }}>
          <TouchableOpacity 
            onPress={() => router.push('/(features)/(main)/practice')} 
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#1C1F24', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}
          >
            <MaterialIcons name="arrow-back" size={24} color={'#ECEDEE'} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 26, fontWeight: '700' }}>Quiz</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 4 }}>Escolha como prefere estudar.</Text>
          </View>
          <QuizActionButton label="Criar Planejamento" icon="auto-awesome" onPress={() => router.push('/planning' as never)} />

          {savedPlans.length > 0 && (
            <View
              ref={anchorRef}
              style={{ marginLeft: 8 }}
              onLayout={() => {
                anchorRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
                  setAnchorLayout({ x, y: y + height, width, height });
                });
              }}>
              <QuizActionButton
                label="Meus Planos"
                icon="bookmark"
                trailingIcon="arrow-drop-down"
                variant="success-outline"
                onPress={() => setDropdownOpen(true)}
              />
            </View>
          )}

          <SavedPlansDropdown
            plans={plansWithProgress}
            visible={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            onSelect={(plan) => {
              const languageParam = plan.language ? `&language=${plan.language}` : '';
              router.push(`/planning?resume=1&track=${plan.track}&level=${plan.level}${languageParam}` as never);
            }}
            onRemove={removePlan}
            anchorY={anchorLayout.y}
            anchorX={anchorLayout.x}
            anchorWidth={anchorLayout.width}
          />
        </View>

        <View style={{ maxWidth: 880, width: '100%', alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
            <Text style={{ color: '#6B7280', fontSize: 12 }}>Todos os temas</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[0, 1, 2, 3].map((columnIndex) => (
              <View key={columnIndex} style={{ flex: 1, gap: 12 }}>
                {tracks.filter((_, index) => index % 4 === columnIndex).map((track) => (
                  <QuizTrackCard key={track.key} item={track} height={110} fontSize={16} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#111316' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: topPadding, paddingHorizontal: 20, paddingBottom: bottomPadding }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <TouchableOpacity 
          onPress={() => router.push('/(features)/(main)/practice')} 
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1C1F24', alignItems: 'center', justifyContent: 'center' }}
        >
          <MaterialIcons name="arrow-back" size={20} color={'#ECEDEE'} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#ECEDEE', fontSize: 24, fontWeight: '700' }}>Quiz</Text>
          <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>Escolha como prefere estudar.</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
        <View style={{ flex: 1 }}>
          <QuizActionButton label="Criar Planejamento" icon="auto-awesome" onPress={() => router.push('/planning' as never)} fullWidth />
        </View>

        {savedPlans.length > 0 && (
          <View
            ref={anchorRef}
            style={{ flex: 1 }}
            onLayout={() => {
              anchorRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
                setAnchorLayout({ x, y: y + height, width, height });
              });
            }}>
            <QuizActionButton
              label="Meus Planos"
              icon="bookmark"
              trailingIcon="arrow-drop-down"
              variant="success-outline"
              onPress={() => setDropdownOpen(true)}
              fullWidth
            />
          </View>
        )}
      </View>

      <SavedPlansDropdown
        plans={plansWithProgress}
        visible={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        onSelect={(plan) => {
          const languageParam = plan.language ? `&language=${plan.language}` : '';
          router.push(`/planning?resume=1&track=${plan.track}&level=${plan.level}${languageParam}` as never);
        }}
        onRemove={removePlan}
        anchorY={anchorLayout.y}
        anchorX={anchorLayout.x}
        anchorWidth={anchorLayout.width}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28, marginBottom: 16 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
        <Text style={{ color: '#6B7280', fontSize: 12 }}>Todos os temas</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[0, 1].map((columnIndex) => (
          <View key={columnIndex} style={{ flex: 1, gap: 10 }}>
            {tracks.filter((_, index) => index % 2 === columnIndex).map((track) => (
              <QuizTrackCard key={track.key} item={track} fontSize={15} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
