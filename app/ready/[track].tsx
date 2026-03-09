import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { ActivityIndicator, Animated, Easing, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { DesktopSidebar } from '@/components/desktop-sidebar';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import {
    fetchCategoryStats,
    getCategoriesForTrack,
    resolveTrackLabel,
    type CategoryStats,
} from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

function CategoryCard({
  cat,
  track,
  stats,
}: {
  cat: string;
  track: string;
  stats: CategoryStats | undefined;
}) {
  const uniqueStudied = stats?.uniqueStudied ?? 0;
  const totalCards = stats?.totalCards ?? 0;
  const uniqueCorrect = stats?.uniqueCorrect ?? 0;
  const accuracy = stats?.accuracyPercent ?? 0;
  const dueForReview = stats?.dueForReview ?? 0;
  const hasInProgress = stats?.hasInProgressLesson ?? false;

  const accentColor =
    uniqueStudied === 0
      ? '#9BA1A6'
      : accuracy >= 80
        ? '#22C55E'
        : accuracy >= 50
          ? '#F59E0B'
          : '#EF4444';

  const buttonLabel = hasInProgress
    ? 'Continuar'
    : uniqueStudied > 0
      ? 'Estudar'
      : 'Iniciar';

  const buttonIcon = hasInProgress ? 'play-arrow' : uniqueStudied > 0 ? 'replay' : 'play-arrow';

  return (
    <View className="rounded-2xl border border-[#E6E8EB] bg-[#FAFBFC] p-4 dark:border-[#30363D] dark:bg-[#1A1D21] md:w-[48.5%]">
      {/* Title */}
      <View className="flex-row items-center gap-3">
        <View className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
        <Text className="flex-1 text-base font-semibold text-[#11181C] dark:text-[#ECEDEE]">
          {cat}
        </Text>
        {dueForReview > 0 && (
          <View className="flex-row items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 dark:bg-amber-900/30">
            <MaterialIcons name="schedule" size={11} color="#F59E0B" />
            <Text className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {dueForReview} p/ revisar
            </Text>
          </View>
        )}
      </View>

      {/* Stats row */}
      <View className="mt-3 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <MaterialIcons name="check-circle" size={13} color={accentColor} />
          <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">Acertos:</Text>
          <Text className="text-xs font-bold text-[#11181C] dark:text-[#ECEDEE]">
            {uniqueStudied > 0 ? `${uniqueCorrect}/${uniqueStudied} (${accuracy}%)` : '0/0 (0%)'}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <MaterialIcons name="style" size={13} color="#9BA1A6" />
          <Text className="text-xs text-[#687076] dark:text-[#9BA1A6]">Estudados:</Text>
          <Text className="text-xs font-bold text-[#11181C] dark:text-[#ECEDEE]">
            {`${Math.min(uniqueStudied, totalCards)}/${totalCards}`}
          </Text>
        </View>
      </View>



      {/* Accuracy bar */}
      <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E6E8EB] dark:bg-[#2A2F36]">
        <View
          className="h-full rounded-full"
          style={{
            width: `${uniqueStudied > 0 ? accuracy : 0}%`,
            backgroundColor:
              accuracy >= 80 ? '#22C55E' : accuracy >= 50 ? '#F59E0B' : '#EF4444',
          }}
        />
      </View>

      {/* Action button */}
      <View className="mt-3">
        <Link
          href={`/ready/study?track=${encodeURIComponent(track)}&category=${encodeURIComponent(cat)}`}
          asChild>
          <Pressable
            className="flex-row items-center justify-center gap-1.5 rounded-xl py-3 active:opacity-80"
            style={{ backgroundColor: '#3F51B5' }}>
            <MaterialIcons name={buttonIcon} size={16} color="#FFFFFF" />
            <Text className="text-xs font-bold text-white">{buttonLabel}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function CategoryCardDesktop({
  cat,
  track,
  stats,
}: {
  cat: string;
  track: string;
  stats: CategoryStats | undefined;
}) {
  const uniqueStudied = stats?.uniqueStudied ?? 0;
  const totalCards = stats?.totalCards ?? 0;
  const uniqueCorrect = stats?.uniqueCorrect ?? 0;
  const accuracy = stats?.accuracyPercent ?? 0;
  const dueForReview = stats?.dueForReview ?? 0;
  const hasInProgress = stats?.hasInProgressLesson ?? false;

  const accentColor =
    uniqueStudied === 0
      ? '#6B7280'
      : accuracy >= 80
        ? '#22C55E'
        : accuracy >= 50
          ? '#F59E0B'
          : '#EF4444';

  const buttonLabel = hasInProgress ? 'Continuar' : uniqueStudied > 0 ? 'Estudar' : 'Iniciar';
  const buttonIcon: ComponentProps<typeof MaterialIcons>['name'] = hasInProgress ? 'play-arrow' : uniqueStudied > 0 ? 'replay' : 'play-arrow';

  return (
    <Link
      href={`/ready/study?track=${encodeURIComponent(track)}&category=${encodeURIComponent(cat)}`}
      asChild>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#13151a' : '#0D0F10',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#1E2328',
          overflow: 'hidden',
          opacity: pressed ? 0.92 : 1,
        })}>
        {/* Barra de acento lateral */}
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: accentColor, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }} />

        <View style={{ paddingVertical: 18, paddingLeft: 24, paddingRight: 20 }}>
          {/* Linha superior: nome + badge revisão */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Text style={{ flex: 1, color: '#ECEDEE', fontSize: 15, fontWeight: '600' }}>{cat}</Text>
            {dueForReview > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#451a03', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                <MaterialIcons name="schedule" size={11} color="#F59E0B" />
                <Text style={{ color: '#F59E0B', fontSize: 10, fontWeight: '700' }}>{dueForReview} p/ revisar</Text>
              </View>
            )}
          </View>

          {/* Stats row */}
          <View style={{ flexDirection: 'row', gap: 20, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <MaterialIcons name="check-circle" size={13} color={accentColor} />
              <Text style={{ color: '#9BA1A6', fontSize: 12 }}>Acertos: </Text>
              <Text style={{ color: '#ECEDEE', fontSize: 12, fontWeight: '700' }}>
                {uniqueStudied > 0 ? `${uniqueCorrect}/${uniqueStudied} (${accuracy}%)` : '0/0 (0%)'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <MaterialIcons name="style" size={13} color="#6B7280" />
              <Text style={{ color: '#9BA1A6', fontSize: 12 }}>Cards: </Text>
              <Text style={{ color: '#ECEDEE', fontSize: 12, fontWeight: '700' }}>
                {`${Math.min(uniqueStudied, totalCards)}/${totalCards}`}
              </Text>
            </View>
          </View>



          {/* Barra de progresso */}
          <View style={{ height: 4, backgroundColor: '#1E2328', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
            <View
              style={{
                height: '100%',
                borderRadius: 4,
                width: `${uniqueStudied > 0 ? accuracy : 0}%`,
                backgroundColor: accentColor,
              }}
            />
          </View>

          {/* Botão */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#3F51B520', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
              <MaterialIcons name={buttonIcon} size={15} color="#818CF8" />
              <Text style={{ color: '#818CF8', fontSize: 13, fontWeight: '600' }}>{buttonLabel}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

function MasterTestButton({ track }: { track: string }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.3, 0.5, 0.7, 1],
    outputRange: [0.15, 0.4, 0.15, 0.4, 0.15],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 300],
  });

  return (
    <Link
      href={`/ready/study?track=${encodeURIComponent(track)}&mode=master-test`}
      asChild>
      <Pressable className="mt-4 overflow-hidden rounded-2xl active:opacity-80"
        style={{
          borderWidth: 1.5,
          borderColor: '#D4A437',
          ...Platform.select({
            ios: {
              shadowColor: '#FFD700',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.35,
              shadowRadius: 8,
            },
            android: { elevation: 6 },
            default: {},
          }),
        }}>
        {/* Gold background */}
        <View style={{
          backgroundColor: '#1A1500',
          paddingVertical: 16,
          paddingHorizontal: 20,
        }}>
          {/* Shimmer overlay */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 80,
              backgroundColor: '#FFD700',
              opacity: shimmerOpacity,
              transform: [{ translateX: shimmerTranslate }],
            }}
            pointerEvents="none"
          />

          {/* Content */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <MaterialIcons name="emoji-events" size={22} color="#FFD700" />
            <View>
              <Text style={{
                color: '#FFD700',
                fontWeight: '800',
                fontSize: 15,
                letterSpacing: 1,
              }}>
                TESTE MASTER
              </Text>
              <Text style={{
                color: '#D4A437',
                fontSize: 11,
                marginTop: 2,
              }}>
                20 questões aleatórias do tema
              </Text>
            </View>
            <MaterialIcons name="arrow-forward" size={18} color="#D4A437" />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export default function ReadyTrackCategoriesScreen() {
  const { track: encodedTrack } = useLocalSearchParams<{ track: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const track = useMemo(() => decodeURIComponent(encodedTrack ?? ''), [encodedTrack]);
  const label = resolveTrackLabel(track);

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [statsMap, setStatsMap] = useState<Record<string, CategoryStats>>({});
  const [loadingStats, setLoadingStats] = useState(true);

  const loadCategories = useCallback(async () => {
    if (!track) {
      setCategories([]);
      setLoadingCategories(false);
      return;
    }

    try {
      setLoadingCategories(true);
      const data = await getCategoriesForTrack(track);
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [track]);

  useFocusEffect(
    useCallback(() => {
      void loadCategories();
    }, [loadCategories]),
  );

  const loadStats = useCallback(async () => {
    if (!user || !track || categories.length === 0) {
      setLoadingStats(false);
      return;
    }
    try {
      setLoadingStats(true);
      const results = await Promise.all(
        categories.map(async (cat) => {
          const stats = await fetchCategoryStats(user.id, track, cat);
          return [cat, stats] as const;
        }),
      );
      setStatsMap(Object.fromEntries(results));
    } catch {
      // silently fail
    } finally {
      setLoadingStats(false);
    }
  }, [categories, user, track]);

  useFocusEffect(
    useCallback(() => {
      void loadStats();
    }, [loadStats]),
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = term ? categories.filter((c) => c.toLowerCase().includes(term)) : [...categories];
    return list.sort((a, b) => {
      const aStudied = statsMap[a]?.totalAnswered ?? 0;
      const bStudied = statsMap[b]?.totalAnswered ?? 0;
      return bStudied - aStudied;
    });
  }, [categories, searchTerm, statsMap]);

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#0D0F10' }}>
        <DesktopSidebar />

        {/* Conteúdo principal */}
        <ScrollView
          style={{ flex: 1, backgroundColor: '#111316' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 32, paddingBottom: 48 }}>

          {/* Breadcrumb / voltar */}
          <Pressable
            onPress={() => router.back()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24, alignSelf: 'flex-start' }}>
            <MaterialIcons name="arrow-back" size={18} color="#687076" />
            <Text style={{ color: '#687076', fontSize: 14 }}>Voltar para Temas</Text>
          </Pressable>

          {/* Header */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 28, fontWeight: '700' }}>{label}</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 6 }}>
              {categories.length} categorias disponíveis para estudo.
            </Text>
          </View>

          {/* Teste Master */}
          <Link href={`/ready/study?track=${encodeURIComponent(track)}&mode=master-test`} asChild>
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#120f00' : '#1A1500',
                borderWidth: 1.5,
                borderColor: '#D4A437',
                borderRadius: 16,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                marginBottom: 24,
              })}>
              <MaterialIcons name="emoji-events" size={28} color="#FFD700" />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFD700', fontWeight: '800', fontSize: 15, letterSpacing: 0.8 }}>
                  TESTE MASTER
                </Text>
                <Text style={{ color: '#D4A437', fontSize: 12, marginTop: 3 }}>
                  20 questões aleatórias do tema
                </Text>
              </View>
              <MaterialIcons name="arrow-forward" size={20} color="#D4A437" />
            </Pressable>
          </Link>

          {/* Busca */}
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Pesquisar categoria..."
            placeholderTextColor="#4B5563"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              backgroundColor: '#0D0F10',
              borderWidth: 1,
              borderColor: '#1E2328',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              color: '#ECEDEE',
              fontSize: 14,
              marginBottom: 24,
            }}
          />

          {/* Grid de categorias */}
          {loadingCategories || loadingStats ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <ActivityIndicator size="large" color="#818CF8" />
            </View>
          ) : filtered.length === 0 ? (
            <Text style={{ color: '#6B7280' }}>Nenhuma categoria encontrada.</Text>
          ) : (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {[filtered.filter((_, i) => i % 2 === 0), filtered.filter((_, i) => i % 2 !== 0)].map(
                (col, colIdx) => (
                  <View key={colIdx} style={{ flex: 1, gap: 12 }}>
                    {col.map((cat) => (
                      <CategoryCardDesktop key={cat} cat={cat} track={track ?? ''} stats={statsMap[cat]} />
                    ))}
                  </View>
                )
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">{label}</Text>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">
        {categories.length} categorias disponíveis para estudo.
      </Text>

      {/* Teste Master Button */}
      <MasterTestButton track={track ?? ''} />

      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Pesquisar categoria"
        placeholderTextColor="#9BA1A6"
        autoCapitalize="none"
        autoCorrect={false}
        className="mt-4 rounded-xl border border-[#E6E8EB] bg-white px-3 py-2 text-[#11181C] dark:border-[#30363D] dark:bg-[#1C1F24] dark:text-[#ECEDEE]"
      />

      {loadingCategories || loadingStats ? (
        <View className="mt-10 items-center">
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <View className="mt-5 gap-3 md:flex-row md:flex-wrap">
          {filtered.length === 0 ? (
            <Text className="text-[#687076] dark:text-[#9BA1A6]">
              Nenhuma categoria encontrada.
            </Text>
          ) : (
            filtered.map((cat) => (
              <CategoryCard key={cat} cat={cat} track={track ?? ''} stats={statsMap[cat]} />
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

