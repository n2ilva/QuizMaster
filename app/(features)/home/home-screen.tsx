import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PanelCard } from '@/components/quiz/panel-card';
import { TRACK_STYLE_FALLBACK, trackStyles } from '@/constants/track-styles';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useLogout } from '@/hooks/use-logout';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

import { HomeThemeCard, type HomeThemeItem } from './components/home-theme-card';
import { HOME_FEATURES } from './home.constants';

export function HomeScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const { user } = useAuth();
  const { trackCatalog, dbStats: stats, userProgress: progress } = useData();
  const layoutMode = useLayoutMode();
  const { isDesktop } = useScreenSize();
  const { loggingOut, handleLogout } = useLogout();

  const themes: HomeThemeItem[] = trackCatalog.map((item) => {
    const style = trackStyles[item.key] ?? TRACK_STYLE_FALLBACK;
    return {
      key: item.key,
      label: item.label,
      icon: style.icon,
      color: style.color,
    };
  });

  const textPrimary = '#ECEDEE';
  const textMuted = '#9BA1A6';
  const surfaceColor = '#1A1D21';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0D0F10' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        paddingTop: isDesktop ? 40 : topPadding, 
        paddingBottom: bottomPadding + 32,
        paddingHorizontal: isDesktop ? 40 : 20 
      }}>
      
      {/* Hero Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 32,
        justifyContent: 'space-between'
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: textPrimary, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            {user ? `Olá, ${user.name}!` : 'Bem-vindo!'}
          </Text>
          <Text style={{ color: textMuted, fontSize: 13, marginTop: 4 }}>
            Pronto para impulsionar seu conhecimento hoje?
          </Text>
        </View>
        <Pressable
          onPress={() => !loggingOut && handleLogout()}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: surfaceColor,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
          }}
          disabled={loggingOut}>
          <Ionicons name={loggingOut ? "sync" : "log-out-outline"} size={20} color={textMuted} />
        </Pressable>
      </View>

      {/* Modern Stats Grid */}
      <View style={{ 
        flexDirection: 'row', 
        gap: 12, 
        marginBottom: 32 
      }}>
        <View style={{ 
          flex: 1, 
          backgroundColor: '#1E293B', 
          borderRadius: 24, 
          padding: 18,
          borderWidth: 1,
          borderColor: 'rgba(56,189,248,0.2)'
        }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(56,189,248,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="book" size={18} color="#38BDF8" />
          </View>
          <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quizzes</Text>
          <Text style={{ color: textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 }}>
            {stats ? stats.totalCards.toLocaleString('pt-BR') : '…'}
          </Text>
        </View>

        <View style={{ 
          flex: 1, 
          backgroundColor: '#1A2121', 
          borderRadius: 24, 
          padding: 18,
          borderWidth: 1,
          borderColor: 'rgba(16,185,129,0.2)'
        }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="extension-puzzle" size={18} color="#10B981" />
          </View>
          <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quebra-Cabeça</Text>
          <Text style={{ color: textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 }}>
            {stats ? (stats as any).totalCodingExercises ?? 0 : '…'}
          </Text>
        </View>
      </View>

      {/* Main Content Layout */}
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24 }}>
        
        {/* Themes Column */}
        <View style={{ flex: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Ionicons name="grid-outline" size={20} color="#6366F1" />
            <Text style={{ color: textPrimary, fontSize: 18, fontWeight: '700' }}>Temas de Estudo</Text>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[0, 1].map((columnIndex) => (
              <View key={columnIndex} style={{ flex: 1, gap: 12 }}>
                {themes.filter((_, index) => index % 2 === columnIndex).map((theme) => (
                  <HomeThemeCard key={theme.key} item={theme} />
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Info Column */}
        <View style={{ flex: 2, gap: 24 }}>
          
          <PanelCard compact style={{ backgroundColor: surfaceColor, borderRadius: 24, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Ionicons name="rocket-outline" size={20} color="#F43F5E" />
              <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '700' }}>Como evoluir</Text>
            </View>
            <View style={{ gap: 16 }}>
              {[
                { icon: "chatbox-ellipses", text: "Quiz: Reforce a teoria com repetição espaçada", color: "#38BDF8" },
                { icon: "extension-puzzle", text: "Quebra-Cabeça: Pratique a lógica montando código", color: "#F59E0B" },
                { icon: "analytics", text: "Acompanhe suas métricas em tempo real", color: "#10B981" }
              ].map((step, index) => (
                <View key={index} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={step.icon as any} size={16} color={step.color} />
                  </View>
                  <Text style={{ flex: 1, color: textMuted, fontSize: 13, lineHeight: 18 }}>{step.text}</Text>
                </View>
              ))}
            </View>
          </PanelCard>

          <PanelCard compact style={{ backgroundColor: surfaceColor, borderRadius: 24, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '700' }}>Recursos Premium</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {HOME_FEATURES.map((feature, index) => (
                <View key={index} style={{ 
                  backgroundColor: 'rgba(255,255,255,0.03)', 
                  paddingHorizontal: 12, 
                  paddingVertical: 8, 
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <MaterialCommunityIcons name={feature.icon as any} size={14} color={textMuted} />
                  <Text style={{ color: textMuted, fontSize: 11 }}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </PanelCard>

        </View>
      </View>
    </ScrollView>
  );
}
