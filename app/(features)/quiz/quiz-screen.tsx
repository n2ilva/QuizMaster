import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { QuizActionButton } from '@/components/quiz/action-button';
import { TRACK_STYLE_FALLBACK, trackStyles } from '@/constants/track-styles';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

import { QuizTrackCard, type QuizTrackItem } from './components/quiz-track-card';

export function QuizScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const { trackCatalog, userProgress } = useData();
  const layoutMode = useLayoutMode();
  const router = useRouter();
  const { user } = useAuth();
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
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 4 }}>Selecione um tema de infraestrutura ou segurança para testar seus conhecimentos.</Text>
          </View>
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
          <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>Selecione um tema de infraestrutura ou segurança para testar seus conhecimentos.</Text>
        </View>
      </View>



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
