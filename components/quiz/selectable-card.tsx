import { type ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { QUIZ_COLORS, QUIZ_RADII } from '@/constants/quiz-ui';
import { InteractiveCard } from '@/components/quiz/interactive-card';

function isLightColor(hex: string) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

type SelectableCardProps = {
  title: string;
  subtitle?: string;
  accentColor: string;
  active: boolean;
  onPress: () => void;
  icon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  compact?: boolean;
};

export function SelectableCard({
  title,
  subtitle,
  accentColor,
  active,
  onPress,
  icon,
  containerStyle,
  style,
  contentStyle,
  compact = false,
}: SelectableCardProps) {
  const light = isLightColor(accentColor);
  const activeText = light ? '#1A1A1A' : '#FFFFFF';
  const activeSubText = light ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.7)';

  return (
    <View style={containerStyle}>
      <InteractiveCard
        accentColor={accentColor}
        onPress={onPress}
        outerRadius={compact ? QUIZ_RADII.lg : QUIZ_RADII.xl}
        innerRadius={compact ? QUIZ_RADII.lg - 2 : QUIZ_RADII.xl - 2}
        innerPadding={0}
        scaleTo={1.06}
        style={{ width: '100%' }}
        innerStyle={[
          active
            ? {
                backgroundColor: accentColor,
              }
            : undefined,
          style,
        ]}>
        {({ hovered }) => (
          <View
            style={{
              padding: compact ? 14 : 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: compact ? 12 : 14,
              minHeight: compact ? 72 : 88,
            }}>
            {icon ? (
              <View
                style={{
                  width: compact ? 36 : 44,
                  height: compact ? 36 : 44,
                  borderRadius: compact ? 10 : 12,
                  backgroundColor: active
                    ? 'rgba(0,0,0,0.25)'
                    : hovered
                      ? `${accentColor}30`
                      : `${accentColor}22`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {icon}
              </View>
            ) : null}
            <View style={[{ flex: 1 }, contentStyle]}>
              <Text
                style={{
                  color: active ? activeText : hovered ? '#ECEDEE' : QUIZ_COLORS.textMuted,
                  fontSize: compact ? 15 : 16,
                  fontWeight: '700',
                }}>
                {title}
              </Text>
              {subtitle ? (
                <Text
                  style={{
                    color: active ? activeSubText : hovered ? '#B8C0CC' : QUIZ_COLORS.textFaint,
                    fontSize: compact ? 11 : 13,
                    marginTop: 3,
                  }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>
        )}
      </InteractiveCard>
    </View>
  );
}