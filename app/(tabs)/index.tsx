import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { TRACK_STYLE_FALLBACK, trackStyles, type TrackIcon } from '@/constants/track-styles';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useLogout } from '@/hooks/use-logout';
import { useTabContentPadding } from '@/hooks/use-tab-content-padding';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

type ThemeItem = {
  key: string;
  label: string;
  icon: TrackIcon;
  color: string;
};

type FeatureItem = {
  icon: TrackIcon;
  text: string;
};

const features: FeatureItem[] = [
  { icon: 'menu-book', text: 'Glossário interativo com termos técnicos' },
  { icon: 'lightbulb', text: 'Explicações detalhadas e exemplos práticos' },
  { icon: 'emoji-events', text: 'Medalhas: Bronze, Prata, Ouro e Diamante' },
  { icon: 'leaderboard', text: 'Ranking comunitário por nível de medalha' },
  { icon: 'speed', text: 'Pontuação por acertos e velocidade de resposta' },
  { icon: 'timer', text: 'Temporizador por questão em tempo real' },
  { icon: 'play-circle-filled', text: 'Retome lições de onde parou' },
  { icon: 'bar-chart', text: 'Progresso detalhado por categoria e nível' },
  { icon: 'auto-awesome', text: 'Repetição espaçada adaptativa (SRS)' },
];

export default function HomeScreen() {
  const bottomPadding = useTabContentPadding();
  const { user } = useAuth();
  const { trackCatalog, dbStats: stats } = useData();
  const isDesktop = useIsDesktop();
  const { loggingOut, handleLogout } = useLogout();

  const themes: ThemeItem[] = trackCatalog.map((item) => {
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
        contentContainerStyle={{ paddingBottom: bottomPadding, padding: 32 }}>

        {/* Desktop Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 26, fontWeight: '700' }}>
              {user ? `Olá, ${user.name}! 👋` : 'Bem-vindo!'}
            </Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 4 }}>
              Teste seus conhecimentos e evolua com questões desafiadoras.
            </Text>
          </View>
          <Link href="/(tabs)/ready" asChild>
            <Pressable
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: pressed ? '#3348a0' : '#3F51B5',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 12,
              })}>
              <MaterialIcons name="rocket-launch" size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14, letterSpacing: 0.5 }}>
                BORA ESTUDAR!
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
          <View style={{ flex: 1, backgroundColor: '#0EA5E9', borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <MaterialIcons name="layers" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Quiz
              </Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '800' }}>
              {stats ? stats.totalCards.toLocaleString('pt-BR') : '…'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>questões disponíveis</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#8B5CF6', borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <MaterialIcons name="category" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Temas
              </Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '800' }}>
              {stats ? stats.activeTracks : '…'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>temas ativos</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#0D0F10', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E2328' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <MaterialIcons name="auto-awesome" size={18} color="#A5B4FC" />
              <Text style={{ color: '#9BA1A6', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Sistema
              </Text>
            </View>
            <Text style={{ color: '#ECEDEE', fontSize: 20, fontWeight: '700', marginTop: 4 }}>
              Repetição
            </Text>
            <Text style={{ color: '#9BA1A6', fontSize: 13, marginTop: 4 }}>espaçada adaptativa</Text>
          </View>
        </View>

        {/* Main 2-column grid */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {/* Left column */}
          <View style={{ flex: 3, gap: 16 }}>

            {/* Themes grid */}
            <View style={{ backgroundColor: '#0D0F10', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E2328' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MaterialIcons name="school" size={18} color="#A5B4FC" />
                <Text style={{ color: '#ECEDEE', fontSize: 15, fontWeight: '600' }}>Temas disponíveis</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {themes.map((t) => (
                  <Link key={t.key} href={`/ready/${encodeURIComponent(t.key)}`} asChild>
                    <Pressable
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                        backgroundColor: pressed ? `${t.color}20` : `${t.color}12`,
                        borderWidth: 1,
                        borderColor: `${t.color}25`,
                      })}>
                      <MaterialIcons name={t.icon} size={15} color={t.color} />
                      <Text style={{ color: t.color, fontSize: 13, fontWeight: '500' }}>{t.label}</Text>
                    </Pressable>
                  </Link>
                ))}
              </View>
            </View>

            {/* How to study */}
            <View style={{ backgroundColor: '#0D0F10', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E2328' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MaterialIcons name="help-outline" size={18} color="#A5B4FC" />
                <Text style={{ color: '#ECEDEE', fontSize: 15, fontWeight: '600' }}>Como estudar</Text>
              </View>
              <View style={{ gap: 12 }}>
                {[
                  { n: '1', text: 'Escolha um tema e uma categoria na aba Quiz', bold: ['tema', 'categoria'] },
                  { n: '2', text: 'O sistema seleciona automaticamente as melhores perguntas para você', bold: ['melhores perguntas'] },
                  { n: '3', text: 'Responda e aprenda com explicações detalhadas e exemplos', bold: ['explicações detalhadas'] },
                  { n: '4', text: 'Perguntas erradas voltam mais frequência — repetição espaçada para fixar', bold: ['repetição espaçada'] },
                ].map((step) => (
                  <View key={step.n} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(63,81,181,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                      <Text style={{ color: '#A5B4FC', fontSize: 11, fontWeight: '700' }}>{step.n}</Text>
                    </View>
                    <Text style={{ color: '#9BA1A6', fontSize: 13, lineHeight: 20, flex: 1 }}>{step.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Right column */}
          <View style={{ flex: 2, gap: 16 }}>
            {/* Medals */}
            <View style={{ backgroundColor: '#0D0F10', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E2328' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MaterialIcons name="emoji-events" size={18} color="#F59E0B" />
                <Text style={{ color: '#ECEDEE', fontSize: 15, fontWeight: '600' }}>Medalhas</Text>
              </View>
              <View style={{ gap: 8 }}>
                {[
                  { emoji: '🥉', label: 'Bronze', range: '0 — 500 pts', color: '#CD7F32' },
                  { emoji: '🥈', label: 'Prata', range: '501 — 1.500 pts', color: '#9CA3AF' },
                  { emoji: '🥇', label: 'Ouro', range: '1.501 — 3.000 pts', color: '#F59E0B' },
                  { emoji: '💎', label: 'Diamante', range: '3.000+ pts', color: '#60A5FA' },
                ].map((m) => (
                  <View
                    key={m.label}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      backgroundColor: '#151718',
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}>
                    <Text style={{ fontSize: 18 }}>{m.emoji}</Text>
                    <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '600', flex: 1 }}>{m.label}</Text>
                    <Text style={{ color: m.color, fontSize: 12, fontWeight: '500' }}>{m.range}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 12, lineHeight: 16 }}>
                Pontuação baseada em questões respondidas, taxa de acerto e velocidade.
              </Text>
            </View>

            {/* Features */}
            <View style={{ backgroundColor: '#0D0F10', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E2328' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MaterialIcons name="auto-awesome" size={18} color="#8B5CF6" />
                <Text style={{ color: '#ECEDEE', fontSize: 15, fontWeight: '600' }}>Recursos</Text>
              </View>
              <View style={{ gap: 10 }}>
                {features.map((f, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                    <MaterialIcons name={f.icon} size={15} color="#6B7280" style={{ marginTop: 1 }} />
                    <Text style={{ color: '#9BA1A6', fontSize: 12, lineHeight: 18, flex: 1 }}>{f.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}>

      {/* Header */}
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#3F51B5]">
          <MaterialIcons name="style" size={22} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">QuizMaster</Text>
        </View>
        <Pressable
          onPress={() => {
            if (!loggingOut) {
              void handleLogout();
            }
          }}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-60"
          disabled={loggingOut}>
          <MaterialIcons
            name={loggingOut ? 'hourglass-empty' : 'logout'}
            size={22}
            color="#9BA1A6"
          />
        </Pressable>
      </View>

      <Text className="mt-3 text-base leading-6 text-[#687076] dark:text-[#9BA1A6]">
        {user ? (
          <>
            Olá, <Text className="font-bold text-[#11181C] dark:text-[#ECEDEE]">{user.name}</Text>!
          </>
        ) : (
          'Bem-vindo!'
        )}{' '}
        Teste seus conhecimentos e evolua com questões desafiadoras.
      </Text>

      {/* CTA */}
      <Link href="/(tabs)/ready" asChild>
        <Pressable className="mt-5 flex-row items-center justify-center gap-2 rounded-2xl bg-[#3F51B5] px-5 py-4 active:opacity-80">
          <MaterialIcons name="rocket-launch" size={20} color="#FFFFFF" />
          <Text className="text-base font-bold tracking-wide text-white">BORA ESTUDAR!</Text>
        </Pressable>
      </Link>

      {/* Stats */}
      <View className="mt-5 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-[#F0F9FF] p-4 dark:bg-[#0EA5E9]/10">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="layers" size={16} color="#0EA5E9" />
            <Text className="text-xs uppercase tracking-wide text-[#0369A1] dark:text-[#7DD3FC]">Quiz</Text>
          </View>
          <Text className="mt-2 text-3xl font-bold text-[#0C4A6E] dark:text-[#E0F2FE]">
            {stats ? stats.totalCards.toLocaleString('pt-BR') : '…'}
          </Text>
        </View>
        <View className="flex-1 rounded-2xl bg-[#F5F3FF] p-4 dark:bg-[#8B5CF6]/10">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="category" size={16} color="#8B5CF6" />
            <Text className="text-xs uppercase tracking-wide text-[#5B21B6] dark:text-[#C4B5FD]">Temas</Text>
          </View>
          <Text className="mt-2 text-3xl font-bold text-[#3B0764] dark:text-[#EDE9FE]">
            {stats ? stats.activeTracks : '…'}
          </Text>
        </View>
      </View>

      {/* Themes grid */}
      <View className="mt-5 rounded-2xl bg-[#FAFBFC] p-4 dark:bg-[#1A1D21]">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="school" size={18} color="#687076" />
          <Text className="text-base font-semibold text-[#11181C] dark:text-[#ECEDEE]">Temas disponíveis</Text>
        </View>
        <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
          {themes.map((t) => (
            <View
              key={t.key}
              className="flex-row items-center gap-2 rounded-lg px-3 py-2"
              style={{ backgroundColor: `${t.color}12` }}>
              <MaterialIcons name={t.icon} size={14} color={t.color} />
              <Text className="text-xs font-medium" style={{ color: t.color }}>{t.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How to study */}
      <View className="mt-3 rounded-2xl bg-[#FAFBFC] p-4 dark:bg-[#1A1D21]">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="help-outline" size={18} color="#3F51B5" />
          <Text className="text-base font-semibold text-[#11181C] dark:text-[#ECEDEE]">Como estudar</Text>
        </View>
        <View className="mt-3 gap-3">
          <View className="flex-row items-start gap-2.5">
            <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-[#3F51B5]/10">
              <Text className="text-[10px] font-bold text-[#3F51B5]">1</Text>
            </View>
            <Text className="flex-1 text-sm leading-5 text-[#687076] dark:text-[#9BA1A6]">
              Escolha um <Text className="font-semibold text-[#11181C] dark:text-[#ECEDEE]">tema</Text> e uma <Text className="font-semibold text-[#11181C] dark:text-[#ECEDEE]">categoria</Text> na aba Quiz
            </Text>
          </View>
          <View className="flex-row items-start gap-2.5">
            <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-[#3F51B5]/10">
              <Text className="text-[10px] font-bold text-[#3F51B5]">2</Text>
            </View>
            <Text className="flex-1 text-sm leading-5 text-[#687076] dark:text-[#9BA1A6]">
              O sistema seleciona automaticamente as <Text className="font-semibold text-[#11181C] dark:text-[#ECEDEE]">melhores perguntas</Text> para você com base no seu desempenho
            </Text>
          </View>
          <View className="flex-row items-start gap-2.5">
            <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-[#3F51B5]/10">
              <Text className="text-[10px] font-bold text-[#3F51B5]">3</Text>
            </View>
            <Text className="flex-1 text-sm leading-5 text-[#687076] dark:text-[#9BA1A6]">
              Responda e aprenda com <Text className="font-semibold text-[#11181C] dark:text-[#ECEDEE]">explicações detalhadas</Text> e exemplos
            </Text>
          </View>
          <View className="flex-row items-start gap-2.5">
            <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-[#3F51B5]/10">
              <Text className="text-[10px] font-bold text-[#3F51B5]">4</Text>
            </View>
            <Text className="flex-1 text-sm leading-5 text-[#687076] dark:text-[#9BA1A6]">
              Perguntas que você errou voltam com mais frequência — <Text className="font-semibold text-[#11181C] dark:text-[#ECEDEE]">repetição espaçada</Text> para fixar o conteúdo
            </Text>
          </View>
        </View>
      </View>

      {/* Medals */}
      <View className="mt-3 rounded-2xl bg-[#FAFBFC] p-4 dark:bg-[#1A1D21]">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="emoji-events" size={18} color="#F59E0B" />
          <Text className="text-base font-semibold text-[#11181C] dark:text-[#ECEDEE]">Medalhas</Text>
        </View>
        <View className="mt-3 gap-2.5">
          {[
            { emoji: '🥉', label: 'Bronze', range: '0 — 500 pts', color: '#CD7F32' },
            { emoji: '🥈', label: 'Prata', range: '501 — 1.500 pts', color: '#9CA3AF' },
            { emoji: '🥇', label: 'Ouro', range: '1.501 — 3.000 pts', color: '#F59E0B' },
            { emoji: '💎', label: 'Diamante', range: '3.000+ pts', color: '#60A5FA' },
          ].map((m) => (
            <View key={m.label} className="flex-row items-center gap-3 rounded-xl bg-white px-3 py-2.5 dark:bg-[#151718]">
              <Text className="text-lg">{m.emoji}</Text>
              <Text className="flex-1 text-sm font-semibold text-[#11181C] dark:text-[#ECEDEE]">{m.label}</Text>
              <Text className="text-xs font-medium" style={{ color: m.color }}>{m.range}</Text>
            </View>
          ))}
        </View>
        <Text className="mt-3 text-xs leading-4 text-[#9BA1A6]">
          Pontuação baseada em questões respondidas, taxa de acerto e velocidade.
        </Text>
      </View>

      {/* Features */}
      <View className="mt-3 rounded-2xl bg-[#FAFBFC] p-4 dark:bg-[#1A1D21]">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="auto-awesome" size={18} color="#8B5CF6" />
          <Text className="text-base font-semibold text-[#11181C] dark:text-[#ECEDEE]">Recursos</Text>
        </View>
        <View className="mt-3 flex-row flex-wrap gap-x-2 gap-y-2.5">
          {features.map((f, i) => (
            <View key={i} className="w-[48%] flex-row items-start gap-2">
              <MaterialIcons name={f.icon} size={14} color="#9BA1A6" style={{ marginTop: 2 }} />
              <Text className="flex-1 text-xs leading-4 text-[#687076] dark:text-[#9BA1A6]">{f.text}</Text>
            </View>
          ))}
        </View>
      </View>


    </ScrollView>
  );
}

