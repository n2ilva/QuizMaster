import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { SCORE_LEVEL_COLORS, SCORE_LEVEL_EMOJIS, SCORE_LEVEL_RANGES, SCORE_LEVELS } from '@/constants/score-levels';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { fetchUserProgress, fetchUsersByLevel, getScoreLevel, updateUserProfile, type ScoreLevel, type UserProfile } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

import { CommunityUserCard } from './components/community-user-card';

export function CommunityScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const { user } = useAuth();
  const layoutMode = useLayoutMode();
  const isDesktop = layoutMode === 'desktop';

  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<ScoreLevel>('Bronze');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [myProgress, setMyProgress] = useState<any>(null);

  const loadCommunityData = useCallback(async (level: ScoreLevel) => {
    try {
      setLoading(true);
      const communityUsers = await fetchUsersByLevel(level, 100);
      setUsers(communityUsers);

      if (user) {
        const currentPosition = communityUsers.findIndex((u) => u.userId === user.id);
        setCurrentUserRank(currentPosition !== -1 ? currentPosition + 1 : null);
      }
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const init = useCallback(async () => {
    if (!user) return;
    try {
      if (user.name) {
        await updateUserProfile(user.id, user.name);
      }
      const progress = await fetchUserProgress(user.id);
      setMyProgress(progress);
      const scoreLevel = getScoreLevel(progress.totalScore);
      setSelectedLevel(scoreLevel);
      await loadCommunityData(scoreLevel);
    } catch (error) {
      console.error('Erro no loading inicial:', error);
    }
  }, [user, loadCommunityData]);

  useFocusEffect(
    useCallback(() => {
      void init();
    }, [init]),
  );

  const handleLevelChange = (level: ScoreLevel) => {
    setSelectedLevel(level);
    void loadCommunityData(level);
  };

  const textPrimary = '#ECEDEE';
  const textMuted = '#9BA1A6';
  const surfaceColor = '#1A1D21';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0D0F10' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        paddingTop: isDesktop ? 40 : topPadding, 
        paddingBottom: bottomPadding + 20,
        paddingHorizontal: isDesktop ? 40 : 20 
      }}>
      
      {/* Header moderno */}
      <View style={{ marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <View style={{ padding: 10, borderRadius: 12, backgroundColor: 'rgba(99,102,241,0.15)' }}>
            <Ionicons name="people" size={24} color="#6366F1" />
          </View>
          <View>
            <Text style={{ color: textPrimary, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>Comunidade</Text>
            <Text style={{ color: textMuted, fontSize: 13 }}>Desafie-se e suba no ranking global</Text>
          </View>
        </View>
      </View>

      {/* Meus Stats Rápidos */}
      {myProgress && (
        <View style={{ 
          flexDirection: 'row', 
          backgroundColor: surfaceColor, 
          borderRadius: 24, 
          padding: 20, 
          marginBottom: 32,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.05)',
          alignItems: 'center',
          gap: 16
        }}>
          <View style={{ 
            width: 56, height: 56, borderRadius: 28, 
            backgroundColor: SCORE_LEVEL_COLORS[getScoreLevel(myProgress.totalScore)] + '20',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Text style={{ fontSize: 28 }}>{SCORE_LEVEL_EMOJIS[getScoreLevel(myProgress.totalScore)]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Sua Pontuação</Text>
            <Text style={{ color: textPrimary, fontSize: 22, fontWeight: '800' }}>{myProgress.totalScore} pts</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Posição</Text>
            <Text style={{ color: '#F59E0B', fontSize: 22, fontWeight: '800' }}>{currentUserRank ? `#${currentUserRank}` : '—'}</Text>
          </View>
        </View>
      )}

      {/* Seletor de Nível (Tabs) */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 16 }}>Ranking por Liga</Text>
        <View style={{ flexDirection: 'row', backgroundColor: surfaceColor, borderRadius: 16, padding: 6, gap: 4 }}>
          {SCORE_LEVELS.map((level) => {
            const isActive = selectedLevel === level;
            return (
              <Pressable
                key={level}
                onPress={() => handleLevelChange(level)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: isActive ? '#31353B' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6
                }}>
                <Text style={{ fontSize: 14 }}>{SCORE_LEVEL_EMOJIS[level]}</Text>
                {(!isDesktop && isActive) || isDesktop ? (
                   <Text style={{ 
                    color: isActive ? textPrimary : textMuted, 
                    fontSize: 12, 
                    fontWeight: isActive ? '700' : '500' 
                  }}>
                    {level}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Lista de Ranking */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ color: textMuted, fontSize: 13, fontWeight: '600' }}>Top 100 Jogadores</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' }} />
            <Text style={{ color: '#22C55E', fontSize: 11, fontWeight: '700' }}>AO VIVO</Text>
          </View>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={{ color: textMuted, marginTop: 16, fontSize: 13 }}>Sincronizando ranking...</Text>
          </View>
        ) : (
          <View style={{ gap: 4 }}>
            {users.length === 0 ? (
              <View style={{ paddingVertical: 60, alignItems: 'center', backgroundColor: surfaceColor, borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                <MaterialCommunityIcons name="trophy-variant-outline" size={48} color={textMuted} />
                <Text style={{ color: textMuted, marginTop: 12, fontSize: 14 }}>Nenhum jogador nesta liga ainda.</Text>
              </View>
            ) : (
              users.map((profile, index) => (
                <CommunityUserCard
                  key={profile.userId}
                  userProfile={profile}
                  index={index}
                  isCurrentUser={profile.userId === user?.id}
                  isExpanded={expandedUserId === profile.userId}
                  onToggle={() => setExpandedUserId(expandedUserId === profile.userId ? null : profile.userId)}
                  compact={!isDesktop}
                />
              ))
            )}
          </View>
        )}
      </View>

    </ScrollView>
  );
}
