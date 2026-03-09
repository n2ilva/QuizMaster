import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { TRACK_STYLE_FALLBACK, trackStyles, type TrackIcon } from '@/constants/track-styles';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useTabContentPadding } from '@/hooks/use-tab-content-padding';
import { useData } from '@/providers/data-provider';

type TrackCard = {
  key: string;
  label: string;
  icon: TrackIcon;
  color: string;
};

export default function ReadyCardsScreen() {
  const bottomPadding = useTabContentPadding();
  const { trackCatalog } = useData();
  const isDesktop = useIsDesktop();

  const tracks: TrackCard[] = trackCatalog.map((item) => {
    const style = trackStyles[item.key] ?? TRACK_STYLE_FALLBACK;
    return {
      key: item.key,
      label: item.label,
      icon: style.icon,
      color: style.color,
    };
  });

  if (isDesktop) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 32, paddingBottom: bottomPadding }}>

        {/* Header desktop */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ color: '#ECEDEE', fontSize: 26, fontWeight: '700' }}>Escolha o tema</Text>
          <Text style={{ color: '#687076', fontSize: 14, marginTop: 4 }}>
            Selecione um tema para avançar para as categorias.
          </Text>
        </View>

        {/* Grid 2 colunas — cards verticais */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {[tracks.filter((_, i) => i % 2 === 0), tracks.filter((_, i) => i % 2 !== 0)].map(
            (col, colIdx) => (
              <View key={colIdx} style={{ flex: 1, gap: 16 }}>
                {col.map((t) => (
                  <Link key={t.key} href={`/ready/${encodeURIComponent(t.key)}`} asChild>
                    <Pressable
                      style={({ pressed }) => ({
                        borderRadius: 20,
                        overflow: 'hidden',
                        backgroundColor: pressed ? '#16181d' : '#0D0F10',
                        borderWidth: 1,
                        borderColor: pressed ? `${t.color}60` : '#1E2328',
                        shadowColor: t.color,
                        shadowOpacity: pressed ? 0.15 : 0,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                      })}>
                      {/* Faixa colorida no topo */}
                      <View style={{ height: 6, backgroundColor: t.color, opacity: 0.85 }} />

                      <View style={{ padding: 24 }}>
                        {/* Ícone */}
                        <View
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            backgroundColor: `${t.color}20`,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                          }}>
                          <MaterialIcons name={t.icon} size={28} color={t.color} />
                        </View>

                        {/* Título */}
                        <Text style={{ color: '#ECEDEE', fontSize: 17, fontWeight: '700', marginBottom: 6 }}>
                          {t.label}
                        </Text>

                        {/* Subtítulo */}
                        <Text style={{ color: '#6B7280', fontSize: 13, lineHeight: 18 }}>
                          Pratique questões sobre {t.label.toLowerCase()} e melhore seu desempenho.
                        </Text>

                        {/* Botão */}
                        <View
                          style={{
                            marginTop: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                          }}>
                          <Text style={{ color: t.color, fontSize: 14, fontWeight: '600' }}>
                            Iniciar quiz
                          </Text>
                          <MaterialIcons name="arrow-forward" size={16} color={t.color} />
                        </View>
                      </View>
                    </Pressable>
                  </Link>
                ))}
              </View>
            )
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
      <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">Escolha o tema</Text>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">
        Selecione um tema para avançar para as categorias.
      </Text>

      <View className="mt-5 gap-3">
        {tracks.map((t) => (
          <Link key={t.key} href={`/ready/${encodeURIComponent(t.key)}`} asChild>
            <Pressable className="flex-row items-center gap-4 rounded-2xl border border-[#E6E8EB] p-4 active:opacity-70 dark:border-[#30363D]">
              <View
                className="h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: t.color }}>
                <MaterialIcons name={t.icon} size={24} color="#FFFFFF" />
              </View>
              <Text className="flex-1 text-lg font-semibold text-[#11181C] dark:text-[#ECEDEE]">
                {t.label}
              </Text>
              <Text className="text-lg text-[#687076] dark:text-[#9BA1A6]">›</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

