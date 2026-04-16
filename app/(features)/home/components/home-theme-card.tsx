import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { InteractiveCard } from '@/components/quiz/interactive-card';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { type TrackIcon } from '@/constants/track-styles';

export type HomeThemeItem = {
  key: string;
  label: string;
  icon: TrackIcon;
  color: string;
};

type HomeThemeCardProps = {
  item: HomeThemeItem;
  fontSize?: number;
};

export function HomeThemeCard({ item, fontSize = 12 }: HomeThemeCardProps) {
  const router = useRouter();

  return (
    <InteractiveCard
      accentColor={item.color}
      onPress={() => router.push(`/track/${encodeURIComponent(item.key)}`)}
      outerRadius={12}
      innerRadius={11}
      innerPadding={0}
      scaleTo={1.04}>
      <View
        style={{
          width: '100%',
          paddingVertical: 10,
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: `${item.color}10`,
          gap: 10
        }}>
        <View style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          backgroundColor: `${item.color}15`,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: `${item.color}30`
        }}>
          <MaterialIcons name={item.icon} size={16} color={item.color} />
        </View>
        <Text
          style={{
            flex: 1,
            color: QUIZ_COLORS.textPrimary,
            fontSize,
            fontWeight: '700',
            textAlign: 'left',
            letterSpacing: -0.2,
          }}
          numberOfLines={1}>
          {item.label}
        </Text>
      </View>
    </InteractiveCard>
  );
}
