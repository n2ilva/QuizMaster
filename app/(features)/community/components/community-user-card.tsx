import React, { useState } from 'react';
import { Pressable, Text, View, useColorScheme } from 'react-native';
import { SCORE_LEVEL_COLORS, SCORE_LEVEL_EMOJIS } from '@/constants/score-levels';
import { type UserProfile } from '@/lib/api';

type CommunityUserCardProps = {
  userProfile: UserProfile;
  index: number;
  isCurrentUser: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  compact?: boolean;
};

export function CommunityUserCard({
  userProfile,
  index,
  isCurrentUser,
  isExpanded,
  onToggle,
  compact = false,
}: CommunityUserCardProps) {
  const levelColor = SCORE_LEVEL_COLORS[userProfile.scoreLevel] ?? '#6B7280';
  const highlightTextColor = isCurrentUser ? '#FBBF24' : compact ? '#A5B4FC' : '#ECEDEE';
  const baseCardBackground = compact ? '#151718' : '#0D0F10';

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isHovered = hovered || pressed;
  const isExpandedOrHovered = isExpanded || isHovered;

  const accentColor = isCurrentUser ? '#F59E0B' : '#6366F1';
  const inactiveAccent = isDark ? '#30363D' : '#E2E8F0';
  
  const bg = isDark ? (isHovered ? '#22252A' : (compact ? '#1C1F24' : '#151718')) : (isHovered ? '#F8FAFC' : '#FFFFFF');
  const borderStatic = isExpanded ? `${accentColor}80` : inactiveAccent;
  const borderHover = isDark ? `${accentColor}50` : `${accentColor}40`;
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';
  const textSecondary = isDark ? '#9BA1A6' : '#64748B';

  const updatedAtDate = React.useMemo(() => {
    if (!userProfile.updatedAt) return new Date(0);
    return userProfile.updatedAt instanceof Date
      ? userProfile.updatedAt
      : (userProfile.updatedAt as any).toDate?.() || new Date(0);
  }, [userProfile.updatedAt]);

  const effectiveStreak = React.useMemo(() => {
    if ((userProfile.streak ?? 0) === 0) return 0;
    const now = new Date();
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    return updatedAtDate.getTime() < yesterdayStart.getTime() ? 0 : userProfile.streak;
  }, [userProfile.streak, updatedAtDate]);

  return (
    <Pressable
      onPress={onToggle}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: bg,
        borderRadius: compact ? 16 : 20,
        borderWidth: 1,
        borderColor: isHovered ? borderHover : borderStatic,
        marginBottom: compact ? 8 : 12,
        shadowColor: isExpandedOrHovered ? accentColor : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isExpandedOrHovered ? 0.08 : 0.03,
        shadowRadius: 12,
        elevation: 2,
      }}>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: compact ? 16 : 20 }}>
        <View
          style={{
            width: compact ? 40 : 44,
            height: compact ? 40 : 44,
            borderRadius: compact ? 12 : 14,
            backgroundColor: isCurrentUser ? 'rgba(245,158,11,0.18)' : isDark ? `${accentColor}15` : `${accentColor}10`,
            borderWidth: isCurrentUser ? 1 : 1,
            borderColor: isCurrentUser ? 'rgba(251,191,36,0.45)' : isDark ? `${accentColor}30` : `${accentColor}20`,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
          <Text style={{ color: isCurrentUser ? '#FBBF24' : accentColor, fontSize: 13, fontWeight: '800' }}>
            #{index + 1}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: isCurrentUser ? '#FBBF24' : textPrimary, fontSize: 15, fontWeight: '700', letterSpacing: -0.3 }}>
            {userProfile.name}
            {isCurrentUser ? ' (você)' : ''}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: compact ? 4 : 6, marginTop: 4 }}>
            <Text style={{ color: textSecondary, fontSize: 11 }}>
              Quiz: {userProfile.totalQuestionsAnswered}
            </Text>
            <Text style={{ color: textSecondary, fontSize: 11 }}>•</Text>
            <Text style={{ color: textSecondary, fontSize: 11 }}>
              Quebra-Cabeça: {userProfile.totalCodingCompleted}
            </Text>
            {effectiveStreak > 0 && (
              <>
                <Text style={{ color: textSecondary, fontSize: 11 }}>•</Text>
                <Text style={{ color: '#F59E0B', fontSize: 11, fontWeight: '700' }}>
                  🔥 {effectiveStreak} {effectiveStreak === 1 ? 'dia' : 'dias'}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: highlightTextColor, fontSize: 16, fontWeight: '800' }}>{userProfile.score}</Text>
            <Text style={{ fontSize: 20 }}>{SCORE_LEVEL_EMOJIS[userProfile.scoreLevel]}</Text>
          </View>
          <Text style={{ color: levelColor, fontSize: 11, fontWeight: '600' }}>{userProfile.scoreLevel}</Text>
        </View>
      </View>

      {isExpanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: isDark ? '#30363D' : '#E2E8F0', paddingHorizontal: compact ? 16 : 20, paddingBottom: compact ? 16 : 20, paddingTop: compact ? 14 : 16 }}>
          <View style={{ gap: 16 }}>
            {/* Quiz Info */}
            {userProfile.topCategory ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: compact ? 10 : 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: textSecondary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                    Quiz: Tema mais estudado
                  </Text>
                  <Text style={{ color: textPrimary, fontSize: 14, fontWeight: '800', letterSpacing: -0.3 }}>{userProfile.topCategory}</Text>
                </View>
                <View style={{ alignItems: 'center', gap: 2 }}>
                  <Text style={{ color: textSecondary, fontSize: 10 }}>Acerto</Text>
                  <Text
                    style={{
                      color:
                        (userProfile.topCategoryAccuracy ?? 0) >= 80
                          ? '#10B981'
                          : (userProfile.topCategoryAccuracy ?? 0) >= 50
                            ? '#F59E0B'
                            : '#EF4444',
                      fontSize: 16,
                      fontWeight: '800',
                    }}>
                    {userProfile.topCategoryAccuracy ?? 0}%
                  </Text>
                </View>
                <View style={{ width: 1, height: 36, backgroundColor: isDark ? '#30363D' : '#E2E8F0' }} />
                <View style={{ alignItems: 'center', gap: 2 }}>
                  <Text style={{ color: textSecondary, fontSize: 10 }}>Tempo/q</Text>
                  <Text style={{ color: accentColor, fontSize: 14, fontWeight: '800' }}>
                    {userProfile.topCategoryAvgTimeMs ? `${(userProfile.topCategoryAvgTimeMs / 1000).toFixed(1)}s` : '—'}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={{ color: textSecondary, fontSize: 12, textAlign: 'center' }}>Sem dados de Quiz disponíveis.</Text>
            )}

            {/* Coding Info */}
            <View style={{ height: 1, backgroundColor: isDark ? '#30363D' : '#E2E8F0', opacity: 0.5 }} />

            {userProfile.topCodingCategory ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: compact ? 10 : 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: textSecondary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                    Quebra-Cabeça: Tema mais estudado
                  </Text>
                  <Text style={{ color: textPrimary, fontSize: 14, fontWeight: '800', letterSpacing: -0.3 }}>{userProfile.topCodingCategory}</Text>
                </View>
                <View style={{ alignItems: 'center', gap: 2 }}>
                  <Text style={{ color: textSecondary, fontSize: 10 }}>Eficiência</Text>
                  <Text
                    style={{
                      color:
                        (userProfile.topCodingAccuracy ?? 0) >= 80
                          ? '#10B981'
                          : (userProfile.topCodingAccuracy ?? 0) >= 50
                            ? '#F59E0B'
                            : '#EF4444',
                      fontSize: 16,
                      fontWeight: '800',
                    }}>
                    {userProfile.topCodingAccuracy ?? 0}%
                  </Text>
                </View>
                <View style={{ width: 1, height: 36, backgroundColor: isDark ? '#30363D' : '#E2E8F0' }} />
                <View style={{ alignItems: 'center', gap: 2 }}>
                  <Text style={{ color: textSecondary, fontSize: 10 }}>Tempo total</Text>
                  <Text style={{ color: accentColor, fontSize: 14, fontWeight: '800' }}>
                    {userProfile.topCodingAvgTimeMs ? `${(userProfile.topCodingAvgTimeMs / 1000).toFixed(0)}s` : '—'}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={{ color: textSecondary, fontSize: 12, textAlign: 'center' }}>Sem dados de Quebra-Cabeça disponíveis.</Text>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}
