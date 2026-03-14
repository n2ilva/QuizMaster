import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { SCORE_LEVEL_COLORS, SCORE_LEVEL_EMOJIS, SCORE_LEVEL_RANGES, SCORE_LEVELS } from '@/constants/score-levels';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useTabContentPadding } from '@/hooks/use-tab-content-padding';
import { ensureUserProfile, fetchUserProgress, fetchUsersByLevel, getScoreLevel, type ScoreLevel, type UserProfile } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

export default function CommunityScreen() {
  const bottomPadding = useTabContentPadding();
  const { user } = useAuth();
  const { userProgress: cachedProgress } = useData();
  const { isDesktop, isTablet, isMobile } = useScreenSize();

  const cachedScoreLevel = cachedProgress ? getScoreLevel(cachedProgress.totalScore) : 'Bronze';
  const [loading, setLoading] = useState(true);
  const [userScoreLevel, setUserScoreLevel] = useState<ScoreLevel>(cachedScoreLevel);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  const loadCommunity = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Garante que o usuário tem um perfil na comunidade
      if (user.name) {
        await ensureUserProfile(user.id, user.name);
      }

      // Use cached progress on first load if available, otherwise fetch
      let scoreLevel: ScoreLevel;
      if (isFirstLoad.current && cachedProgress) {
        scoreLevel = getScoreLevel(cachedProgress.totalScore);
        isFirstLoad.current = false;
      } else {
        const progress = await fetchUserProgress(user.id);
        scoreLevel = getScoreLevel(progress.totalScore);
        isFirstLoad.current = false;
      }

      setUserScoreLevel(scoreLevel);

      const communityUsers = await fetchUsersByLevel(scoreLevel, 100);
      setUsers(communityUsers);

      const currentPosition = communityUsers.findIndex(u => u.userId === user.id);
      if (currentPosition !== -1) {
        setCurrentUserRank(currentPosition + 1);
      }
    } catch (error) {
      console.error('Erro ao carregar comunidade:', error);
    } finally {
      setLoading(false);
    }
    // cachedProgress é usado apenas no primeiro carregamento (isFirstLoad); excluído
    // intencionalmente para não recriar o callback quando o progresso muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void loadCommunity();
    }, [loadCommunity])
  );

  if (isDesktop || isTablet) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 32,
          paddingTop: 32,
          paddingBottom: bottomPadding,
        }}>

        {/* Max-width wrapper */}
        {/* Desktop Header — fora do wrapper, ocupa 100% */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 26, fontWeight: '700' }}>Comunidade</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 4 }}>
              Ranking de usuários{loading ? '...' : (
                <Text style={{ fontWeight: '700', color: SCORE_LEVEL_COLORS[userScoreLevel] }}>
                  {' '}{userScoreLevel} {SCORE_LEVEL_EMOJIS[userScoreLevel]}
                </Text>
              )}
            </Text>
          </View>
          {currentUserRank && (
            <View style={{ backgroundColor: '#F59E0B', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Sua posição</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800' }}>#{currentUserRank}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>de {users.length} usuários</Text>
            </View>
          )}
        </View>

        <View style={{ maxWidth: 960, width: '100%', alignSelf: 'center' }}>

        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <ActivityIndicator size="large" color="#A5B4FC" />
          </View>
        ) : (
          <>
            {/* Linha superior: Como funciona + Medalhas */}
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
              <View style={{ flex: 1, backgroundColor: '#0D0F10', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E2328' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Text style={{ fontSize: 20 }}>🏆</Text>
                  <Text style={{ color: '#ECEDEE', fontSize: 15, fontWeight: '600' }}>Como funciona?</Text>
                </View>
                <View style={{ gap: 10 }}>
                  {[
                    { icon: '📌', text: 'Base: 1 ponto por questão respondida' },
                    { icon: '🎯', text: 'Acurácia: Até 50% de bônus por taxa de acerto' },
                    { icon: '⚡', text: 'Velocidade: Até 25% de bônus por responder rápido' },
                  ].map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: 15 }}>{item.icon}</Text>
                      <Text style={{ color: '#9BA1A6', fontSize: 12, lineHeight: 18, flex: 1 }}>{item.text}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ flex: 1, backgroundColor: '#0D0F10', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E2328' }}>
                <Text style={{ color: '#ECEDEE', fontSize: 15, fontWeight: '600', marginBottom: 14 }}>Medalhas</Text>
                <View style={{ gap: 8 }}>
                  {SCORE_LEVELS.map((level) => (
                    <View key={level} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, backgroundColor: '#151718', borderRadius: 8, paddingHorizontal: 10 }}>
                      <Text style={{ fontSize: 16 }}>{SCORE_LEVEL_EMOJIS[level]}</Text>
                      <Text style={{ color: '#ECEDEE', fontSize: 12, fontWeight: '600', flex: 1 }}>{level}</Text>
                      <Text style={{ color: SCORE_LEVEL_COLORS[level], fontSize: 11 }}>{SCORE_LEVEL_RANGES[level]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Ranking list */}
            <View style={{ gap: 8 }}>
              {users.length === 0 ? (
                <Text style={{ color: '#687076', textAlign: 'center', marginTop: 40 }}>
                  Nenhum usuário encontrado neste nível.
                </Text>
              ) : (
                users.map((userProfile, index) => {
                  const isCurrentUser = userProfile.userId === user?.id;
                  const levelColor = SCORE_LEVEL_COLORS[userProfile.scoreLevel] ?? '#6B7280';
                  const isExpanded = expandedUserId === userProfile.userId;
                  return (
                    <Pressable
                      key={userProfile.userId}
                      onPress={() => setExpandedUserId(isExpanded ? null : userProfile.userId)}
                      style={({ pressed }) => ({
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: isCurrentUser ? 'rgba(245,158,11,0.4)' : '#1E2328',
                        backgroundColor: pressed ? '#17191C' : isCurrentUser ? 'rgba(245,158,11,0.07)' : '#0D0F10',
                        overflow: 'hidden',
                      })}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        padding: 14,
                      }}>
                      {/* Rank badge */}
                      <View style={{
                        width: 38, height: 38, borderRadius: 10,
                        backgroundColor: isCurrentUser ? '#F59E0B' : 'rgba(63,81,181,0.2)',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Text style={{ color: isCurrentUser ? '#FFFFFF' : '#A5B4FC', fontSize: 13, fontWeight: '700' }}>
                          #{index + 1}
                        </Text>
                      </View>

                      {/* User info */}
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          color: isCurrentUser ? '#FBBF24' : '#ECEDEE',
                          fontSize: 14, fontWeight: '600',
                        }}>
                          {userProfile.name}{isCurrentUser ? ' (você)' : ''}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                          <Text style={{ color: '#6B7280', fontSize: 12 }}>{userProfile.totalQuestionsAnswered} questões</Text>
                          <Text style={{ color: '#6B7280', fontSize: 12 }}>·</Text>
                          <Text style={{ color: '#6B7280', fontSize: 12 }}>{userProfile.overallAccuracy}% acertos</Text>
                          {userProfile.streak > 0 && (
                            <>
                              <Text style={{ color: '#6B7280', fontSize: 12 }}>·</Text>
                              <Text style={{ color: '#F59E0B', fontSize: 12, fontWeight: '600' }}>
                                🔥 {userProfile.streak} {userProfile.streak === 1 ? 'dia' : 'dias'}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>

                      {/* Score */}
                      <View style={{ alignItems: 'flex-end', gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ color: isCurrentUser ? '#FBBF24' : '#A5B4FC', fontSize: 16, fontWeight: '700' }}>
                            {userProfile.score}
                          </Text>
                          <Text style={{ fontSize: 20 }}>{SCORE_LEVEL_EMOJIS[userProfile.scoreLevel]}</Text>
                        </View>
                        <Text style={{ color: levelColor, fontSize: 11 }}>{userProfile.scoreLevel}</Text>
                      </View>
                    </View>

                    {/* Mini-card expandido */}
                    {isExpanded && (
                      <View style={{ borderTopWidth: 1, borderTopColor: '#1E2328', marginHorizontal: 14, marginBottom: 14, paddingTop: 12 }}>
                        {userProfile.topCategory ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ color: '#9BA1A6', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Tema mais estudado</Text>
                              <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '700' }}>{userProfile.topCategory}</Text>
                              {userProfile.topCategoryTrack ? (
                                <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>{userProfile.topCategoryTrack}</Text>
                              ) : null}
                            </View>
                            <View style={{ alignItems: 'center', gap: 2 }}>
                              <Text style={{ color: '#9BA1A6', fontSize: 10 }}>Acerto</Text>
                              <Text style={{ color: (userProfile.topCategoryAccuracy ?? 0) >= 80 ? '#22C55E' : (userProfile.topCategoryAccuracy ?? 0) >= 50 ? '#F59E0B' : '#EF4444', fontSize: 16, fontWeight: '800' }}>{userProfile.topCategoryAccuracy ?? 0}%</Text>
                            </View>
                            <View style={{ width: 1, height: 36, backgroundColor: '#1E2328' }} />
                            <View style={{ alignItems: 'center', gap: 2 }}>
                              <Text style={{ color: '#9BA1A6', fontSize: 10 }}>Tempo/questão</Text>
                              <Text style={{ color: '#A5B4FC', fontSize: 13, fontWeight: '700' }}>{userProfile.topCategoryAvgTimeMs ? (userProfile.topCategoryAvgTimeMs / 1000).toFixed(1) + 's' : '—'}</Text>
                            </View>
                          </View>
                        ) : (
                          <Text style={{ color: '#6B7280', fontSize: 12, textAlign: 'center' }}>Sem dados de categorias disponíveis.</Text>
                        )}
                      </View>
                    )}
                    </Pressable>
                  );
                })
              )}
            </View>
          </>
        )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}>
      <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">Comunidade</Text>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">
        Ranking de usuários {loading ? '...' : <Text className="font-bold">{userScoreLevel}</Text>} {loading ? '' : SCORE_LEVEL_EMOJIS[userScoreLevel]}
      </Text>

      {loading ? (
        <View className="mt-20 items-center">
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <>
      {/* Ranking Info */}
      {currentUserRank && (
        <View className="mt-5 rounded-2xl bg-[#F59E0B] p-4">
          <Text className="text-sm text-white/80">Sua posição no ranking</Text>
          <Text className="mt-1 text-3xl font-bold text-white">#{currentUserRank}</Text>
          <Text className="mt-1 text-sm text-white/70">de {users.length} usuários</Text>
        </View>
      )}

      {/* Cards informativos lado a lado */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        {/* Como funciona */}
        <View style={{ flex: 1, backgroundColor: '#0D0F10', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1E2328' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Text style={{ fontSize: 16 }}>🏆</Text>
            <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '600' }}>Como funciona?</Text>
          </View>
          <View style={{ gap: 7 }}>
            {[
              { icon: '📌', text: '1 ponto por questão' },
              { icon: '🎯', text: 'Bônus por acerto' },
              { icon: '⚡', text: 'Bônus por velocidade' },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 12 }}>{item.icon}</Text>
                <Text style={{ color: '#9BA1A6', fontSize: 11, lineHeight: 16, flex: 1 }}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Medalhas */}
        <View style={{ flex: 1, backgroundColor: '#0D0F10', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1E2328' }}>
          <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '600', marginBottom: 10 }}>Medalhas</Text>
          <View style={{ gap: 6 }}>
            {SCORE_LEVELS.map((level) => (
              <View key={level} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 14 }}>{SCORE_LEVEL_EMOJIS[level]}</Text>
                <Text style={{ color: '#ECEDEE', fontSize: 11, fontWeight: '600', flex: 1 }}>{level}</Text>
                <Text style={{ color: SCORE_LEVEL_COLORS[level], fontSize: 10 }}>{SCORE_LEVEL_RANGES[level]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Users List */}
      <View className="mt-5 gap-3">
        {users.length === 0 ? (
          <Text className="mt-4 text-center text-[#687076] dark:text-[#9BA1A6]">
            Nenhum usuário encontrado neste nível.
          </Text>
        ) : (
          users.map((userProfile, index) => {
            const isCurrentUser = userProfile.userId === user?.id;
            const isExpanded = expandedUserId === userProfile.userId;
            return (
              <Pressable
                key={userProfile.userId}
                onPress={() => setExpandedUserId(isExpanded ? null : userProfile.userId)}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isCurrentUser ? 'rgba(245,158,11,0.5)' : '#30363D',
                  backgroundColor: pressed ? '#17191C' : isCurrentUser ? 'rgba(245,158,11,0.08)' : '#151718',
                  overflow: 'hidden',
                })}>
                {/* Linha principal */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
                  {/* Rank */}
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: isCurrentUser ? '#F59E0B' : '#3F51B5',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>#{index + 1}</Text>
                  </View>

                  {/* User Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 14, fontWeight: '600',
                      color: isCurrentUser ? '#FBBF24' : '#ECEDEE',
                    }}>
                      {userProfile.name}{isCurrentUser ? ' (você)' : ''}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 3 }}>
                      <Text style={{ fontSize: 11, color: '#9BA1A6' }}>{userProfile.totalQuestionsAnswered} questões</Text>
                      <Text style={{ fontSize: 11, color: '#9BA1A6' }}>•</Text>
                      <Text style={{ fontSize: 11, color: '#9BA1A6' }}>{userProfile.overallAccuracy}% acertos</Text>
                      {userProfile.streak > 0 && (
                        <>
                          <Text style={{ fontSize: 11, color: '#9BA1A6' }}>•</Text>
                          <Text style={{ fontSize: 11, color: '#F59E0B', fontWeight: '600' }}>🔥 {userProfile.streak} {userProfile.streak === 1 ? 'dia' : 'dias'}</Text>
                        </>
                      )}
                    </View>
                  </View>

                  {/* Score & Medal */}
                  <View style={{ alignItems: 'flex-end', gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: isCurrentUser ? '#FBBF24' : '#A5B4FC' }}>
                        {userProfile.score}
                      </Text>
                      <Text style={{ fontSize: 20 }}>{SCORE_LEVEL_EMOJIS[userProfile.scoreLevel]}</Text>
                    </View>
                    <Text style={{ fontSize: 10, color: SCORE_LEVEL_COLORS[userProfile.scoreLevel] }}>
                      {userProfile.scoreLevel}
                    </Text>
                  </View>
                </View>

                {/* Mini-card expandido */}
                {isExpanded && (
                  <View style={{ borderTopWidth: 1, borderTopColor: '#30363D', marginHorizontal: 12, marginBottom: 12, paddingTop: 10 }}>
                    {userProfile.topCategory ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#9BA1A6', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Tema mais estudado</Text>
                          <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '700' }}>{userProfile.topCategory}</Text>
                          {userProfile.topCategoryTrack ? (
                            <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>{userProfile.topCategoryTrack}</Text>
                          ) : null}
                        </View>
                        <View style={{ alignItems: 'center', gap: 2 }}>
                          <Text style={{ color: '#9BA1A6', fontSize: 10 }}>Acerto</Text>
                          <Text style={{
                            fontSize: 16, fontWeight: '800',
                            color: (userProfile.topCategoryAccuracy ?? 0) >= 80 ? '#22C55E' : (userProfile.topCategoryAccuracy ?? 0) >= 50 ? '#F59E0B' : '#EF4444',
                          }}>{userProfile.topCategoryAccuracy ?? 0}%</Text>
                        </View>
                        <View style={{ width: 1, height: 36, backgroundColor: '#30363D' }} />
                        <View style={{ alignItems: 'center', gap: 2 }}>
                          <Text style={{ color: '#9BA1A6', fontSize: 10 }}>Tempo/questão</Text>
                          <Text style={{ color: '#A5B4FC', fontSize: 13, fontWeight: '700' }}>
                            {userProfile.topCategoryAvgTimeMs ? (userProfile.topCategoryAvgTimeMs / 1000).toFixed(1) + 's' : '—'}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={{ color: '#6B7280', fontSize: 12, textAlign: 'center' }}>Sem dados de categorias disponíveis.</Text>
                    )}
                  </View>
                )}
              </Pressable>
            );
          })
        )}
      </View>
        </>
      )}
    </ScrollView>
  );
}
