import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View, useColorScheme } from 'react-native';

import { DesktopSidebar } from '@/components/desktop-sidebar';
import { QUIZ_COLORS, QUIZ_RADII } from '@/constants/quiz-ui';
import { getCategoryTags } from '@/data/cards/category-tags';
import { CATEGORY_TYPE_LABEL } from '@/data/tracks';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { fetchCategoryStats, getCategoriesForTrack, resolveTrackLabel, type CategoryStats } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

import { MasterTestButton } from './components/master-test-button';
import { ReadyCategoryCard } from './components/ready-category-card';

export function ReadyTrackCategoriesScreen() {
  const { track: encodedTrack } = useLocalSearchParams<{ track: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const layoutMode = useLayoutMode();
  const colorScheme = useColorScheme();
  const track = useMemo(() => decodeURIComponent(encodedTrack ?? ''), [encodedTrack]);
  const label = resolveTrackLabel(track);
  const topPadding = useTopContentPadding();

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
      const results = await Promise.all(categories.map(async (category) => [category, await fetchCategoryStats(user.id, track, category)] as const));
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

  const fuseItems = useMemo(
    () => categories.map((category) => ({ cat: category, name: category, typeLabel: CATEGORY_TYPE_LABEL[category] ?? '', tags: getCategoryTags(track, category).join(' ') })),
    [categories, track],
  );

  const fuse = useMemo(
    () =>
      new Fuse(fuseItems, {
        keys: ['name', 'typeLabel', 'tags'],
        threshold: 0.35,
        includeMatches: true,
      }),
    [fuseItems],
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim();
    const list = term ? fuse.search(term).map((result) => result.item.cat) : [...categories];
    return list.sort((a, b) => (statsMap[b]?.totalAnswered ?? 0) - (statsMap[a]?.totalAnswered ?? 0));
  }, [categories, searchTerm, fuse, statsMap]);

    if (layoutMode === 'desktop') {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: QUIZ_COLORS.surfaceBase }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 32, paddingTop: 32, paddingBottom: 48 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12 }}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#1C1F24',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 4,
                opacity: pressed ? 0.6 : 1,
              })}>
              <MaterialIcons name="arrow-back" size={24} color={QUIZ_COLORS.textPrimary} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={{ color: QUIZ_COLORS.textPrimary, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>{label}</Text>
              <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 14, marginTop: 4 }}>{categories.length} categorias disponíveis para estudo.</Text>
            </View>
          </View>

          <View style={{ width: '100%', maxWidth: 1040, alignSelf: 'center' }}>
            <View style={{ marginBottom: 12 }}>
              <MasterTestButton track={track ?? ''} />
            </View>

            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Pesquisar categoria..."
              placeholderTextColor="#4B5563"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ marginBottom: 24, backgroundColor: QUIZ_COLORS.surfaceStrong, borderWidth: 1, borderColor: QUIZ_COLORS.borderSubtle, borderRadius: QUIZ_RADII.md, paddingHorizontal: 16, paddingVertical: 12, color: QUIZ_COLORS.textPrimary, fontSize: 14 }}
            />

            {loadingCategories || loadingStats ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <ActivityIndicator size="large" color={QUIZ_COLORS.accentHover} />
              </View>
            ) : filtered.length === 0 ? (
              <Text style={{ color: QUIZ_COLORS.textFaint }}>Nenhuma categoria encontrada.</Text>
            ) : (
              <View style={{ flexDirection: 'row', gap: 16 }}>
                {[0, 1, 2].map((columnIndex) => (
                  <View key={columnIndex} style={{ flex: 1, gap: 12 }}>
                    {filtered.filter((_, index) => index % 3 === columnIndex).map((category) => (
                      <ReadyCategoryCard key={category} category={category} track={track ?? ''} stats={statsMap[category]} />
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
    );
  }

  const isDark = colorScheme === 'dark';

  return (
    <ScrollView 
      className="flex-1 bg-white px-5 dark:bg-[#151718]" 
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: 100 }} 
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#1C1F24',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}>
          <MaterialIcons name="arrow-back" size={20} color="#ECEDEE" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text className="text-2xl font-bold tracking-tight text-[#11181C] dark:text-[#ECEDEE]">{label}</Text>
          <Text className="mt-1 text-sm text-[#687076] dark:text-[#9BA1A6]">{categories.length} categorias de estudo.</Text>
        </View>
      </View>

      <View style={{ marginTop: 16, marginBottom: 12 }}>
        <MasterTestButton track={track ?? ''} style={{ width: '100%' }} />
      </View>

      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Pesquisar categoria..."
        placeholderTextColor="#9BA1A6"
        autoCapitalize="none"
        autoCorrect={false}
        style={{ borderRadius: 12, borderWidth: 1, borderColor: '#30363D', backgroundColor: '#1C1F24', paddingHorizontal: 12, paddingVertical: 8, color: '#ECEDEE', fontSize: 14, marginBottom: 8 }}
      />

      {loadingCategories || loadingStats ? (
        <View className="mt-10 items-center">
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <View className="mt-5 gap-3 md:flex-row md:flex-wrap">
          {filtered.length === 0 ? (
            <Text className="text-[#687076] dark:text-[#9BA1A6]">Nenhuma categoria encontrada.</Text>
          ) : (
            filtered.map((category) => <ReadyCategoryCard key={category} category={category} track={track ?? ''} stats={statsMap[category]} />)
          )}
        </View>
      )}
    </ScrollView>
  );
}
