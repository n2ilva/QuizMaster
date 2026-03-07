import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useTabContentPadding } from '@/hooks/use-tab-content-padding';
import { ensureUserProfile, fetchUserProgress, fetchUsersByLevel, getScoreLevel, type ScoreLevel, type UserProfile } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

const scoreLevelEmojis: Record<string, string> = {
  Bronze: '🥉',
  Prata: '🥈',
  Ouro: '🥇',
  Diamante: '💎',
};

const scoreLevelColors: Record<string, string> = {
  Bronze: '#CD7F32',
  Prata: '#C0C0C0',
  Ouro: '#FFD700',
  Diamante: '#00CED1',
};

export default function CommunityScreen() {
  const bottomPadding = useTabContentPadding();
  const { user } = useAuth();
  const { userProgress: cachedProgress } = useData();
  const isDesktop = useIsDesktop();

  const cachedScoreLevel = cachedProgress ? getScoreLevel(cachedProgress.totalScore) : 'Bronze';
  const [loading, setLoading] = useState(true);
  const [userScoreLevel, setUserScoreLevel] = useState<ScoreLevel>(cachedScoreLevel);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const isFirstLoad = useRef(true);

  const loadCommunity = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[Community] Carregando comunidade para usuário:', user.id);
      
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
        console.log('[Community] Progresso do usuário:', progress);
        scoreLevel = getScoreLevel(progress.totalScore);
        isFirstLoad.current = false;
      }
      
      console.log('[Community] Nível de medalha calculado:', scoreLevel);
      setUserScoreLevel(scoreLevel);

      // Busca todos os usuários com o mesmo nível de medalha
      const communityUsers = await fetchUsersByLevel(scoreLevel, 100);
      console.log('[Community] Usuários encontrados:', communityUsers.length);
      setUsers(communityUsers);

      // Encontra a posição do usuário atual no ranking
      const currentPosition = communityUsers.findIndex(u => u.userId === user.id);
      console.log('[Community] Posição do usuário:', currentPosition);
      if (currentPosition !== -1) {
        setCurrentUserRank(currentPosition + 1);
      } else {
        console.warn('[Community] Usuário não encontrado no ranking!');
      }
    } catch (error) {
      console.error('Erro ao carregar comunidade:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void loadCommunity();
    }, [loadCommunity])
  );

  if (isDesktop) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 32, paddingBottom: bottomPadding }}>

        {/* Desktop Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 26, fontWeight: '700' }}>Comunidade</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 4 }}>
              Ranking de usuários{loading ? '...' : (
                <Text style={{ fontWeight: '700', color: scoreLevelColors[userScoreLevel] }}>
                  {' '}{userScoreLevel} {scoreLevelEmojis[userScoreLevel]}
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

        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <ActivityIndicator size="large" color="#A5B4FC" />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>

            {/* Ranking list — largura limitada */}
            <View style={{ flex: 1, maxWidth: 560, gap: 8 }}>
              {users.length === 0 ? (
                <Text style={{ color: '#687076', textAlign: 'center', marginTop: 40 }}>
                  Nenhum usuário encontrado neste nível.
                </Text>
              ) : (
                users.map((userProfile, index) => {
                  const isCurrentUser = userProfile.userId === user?.id;
                  const levelColor = scoreLevelColors[userProfile.scoreLevel] ?? '#6B7280';
                  return (
                    <View
                      key={userProfile.userId}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        padding: 14,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: isCurrentUser ? 'rgba(245,158,11,0.4)' : '#1E2328',
                        backgroundColor: isCurrentUser ? 'rgba(245,158,11,0.07)' : '#0D0F10',
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
                          <Text style={{ fontSize: 20 }}>{scoreLevelEmojis[userProfile.scoreLevel]}</Text>
                        </View>
                        <Text style={{ color: levelColor, fontSize: 11 }}>{userProfile.scoreLevel}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* Sidebar direita — informações */}
            <View style={{ flex: 1, gap: 16, flexShrink: 0 }}>
              <View style={{ flexDirection: 'row', gap: 16 }}>
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
                    {[
                      { emoji: '🥉', label: 'Bronze', range: '0 — 500 pts', color: '#CD7F32' },
                      { emoji: '🥈', label: 'Prata', range: '501 — 1.500 pts', color: '#C0C0C0' },
                      { emoji: '🥇', label: 'Ouro', range: '1.501 — 3.000 pts', color: '#FFD700' },
                      { emoji: '💎', label: 'Diamante', range: '3.000+ pts', color: '#00CED1' },
                    ].map((m) => (
                      <View key={m.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, backgroundColor: '#151718', borderRadius: 8, paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: 16 }}>{m.emoji}</Text>
                        <Text style={{ color: '#ECEDEE', fontSize: 12, fontWeight: '600', flex: 1 }}>{m.label}</Text>
                        <Text style={{ color: m.color, fontSize: 11 }}>{m.range}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
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
        Ranking de usuários {loading ? '...' : <Text className="font-bold">{userScoreLevel}</Text>} {loading ? '' : scoreLevelEmojis[userScoreLevel]}
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

      {/* Users List */}
      <View className="mt-5 gap-3">
        {users.length === 0 ? (
          <Text className="mt-4 text-center text-[#687076] dark:text-[#9BA1A6]">
            Nenhum usuário encontrado neste nível.
          </Text>
        ) : (
          users.map((userProfile, index) => {
            const isCurrentUser = userProfile.userId === user?.id;
            return (
              <View
                key={userProfile.userId}
                className={`flex-row items-center gap-3 rounded-xl border p-3 ${
                  isCurrentUser
                    ? 'border-[#F59E0B] bg-[#F59E0B]/15'
                    : 'border-[#E6E8EB] dark:border-[#30363D]'
                }`}>
                {/* Rank */}
                <View className={`h-10 w-10 items-center justify-center rounded-full ${
                  isCurrentUser ? 'bg-[#F59E0B]' : 'bg-[#3F51B5]'
                }`}>
                  <Text className="text-sm font-bold text-white">#{index + 1}</Text>
                </View>

                {/* User Info */}
                <View className="flex-1">
                  <Text className={`text-sm font-semibold ${
                    isCurrentUser
                      ? 'text-[#D97706] dark:text-[#FBBF24]'
                      : 'text-[#11181C] dark:text-[#ECEDEE]'
                  }`}>
                    {userProfile.name}
                    {isCurrentUser && (
                      <Text className="ml-2 text-xs text-[#D97706] dark:text-[#FBBF24]"> (você)</Text>
                    )}
                  </Text>
                  <View className="mt-1 flex-row flex-wrap gap-x-2 gap-y-0.5">
                    <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">
                      {userProfile.totalQuestionsAnswered} questões
                    </Text>
                    <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">•</Text>
                    <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">
                      {userProfile.overallAccuracy}% acertos
                    </Text>
                    {userProfile.streak > 0 && (
                      <>
                        <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">•</Text>
                        <Text className="text-xs font-semibold text-[#F59E0B] dark:text-[#FBBF24]">
                          🔥 {userProfile.streak} {userProfile.streak === 1 ? 'dia' : 'dias'}
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Score & Medal */}
                <View className="items-end gap-2">
                  <View className="flex-row items-center gap-2">
                    <Text className={`text-lg font-bold ${isCurrentUser ? 'text-[#D97706] dark:text-[#FBBF24]' : 'text-[#3F51B5]'}`}>
                      {userProfile.score}
                    </Text>
                    <Text className="text-2xl">
                      {scoreLevelEmojis[userProfile.scoreLevel]}
                    </Text>
                  </View>
                  <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">pontos</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Score Explanation */}
      <View className="mt-8 rounded-2xl border border-[#E6E8EB] p-4 dark:border-[#30363D]">
        <Text className="text-sm font-semibold text-[#11181C] dark:text-[#ECEDEE]">
          Como funciona o scoring?
        </Text>
        <Text className="mt-2 text-xs leading-5 text-[#687076] dark:text-[#9BA1A6]">
          {`• Base: 1 ponto por questão respondida\n`}
          {`• Acurácia: Até 50% de bônus por taxa de acerto\n`}
          {`• Velocidade: Até 25% de bônus por responder rápido (ideal: 20s por questão)`}
        </Text>
      </View>
        </>
      )}
    </ScrollView>
  );
}
