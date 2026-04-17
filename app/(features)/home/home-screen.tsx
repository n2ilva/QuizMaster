import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View, TouchableOpacity } from 'react-native';

import { PanelCard } from '@/components/quiz/panel-card';
import { TRACK_STYLE_FALLBACK, trackStyles } from '@/constants/track-styles';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useLogout } from '@/hooks/use-logout';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';
import { useRouter } from 'expo-router';

import { HomeThemeCard, type HomeThemeItem } from './components/home-theme-card';
import { HOME_FEATURES } from './home.constants';
import SupportData from '../coding-practice/Data/suportetecnico.json';
import DataCenterData from '../coding-practice/Data/datacenterbuild.json';

export function HomeScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const { user } = useAuth();
  const { trackCatalog, dbStats: stats, userProgress: progress } = useData();
  const layoutMode = useLayoutMode();
  const { isDesktop } = useScreenSize();
  const { loggingOut, handleLogout } = useLogout();
  const router = useRouter();
  
  const totalIncidents = useMemo(() => {
    return (SupportData.categories || []).reduce((acc, cat) => acc + (cat.exercises || []).length, 0);
  }, []);

  const totalDataCenter = useMemo(() => {
    return (DataCenterData.levels || []).length;
  }, []);

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
      <View style={{ gap: 12, marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ 
            flex: 1, 
            backgroundColor: '#1E293B', 
            borderRadius: 24, 
            padding: 18,
            borderWidth: 1,
            borderColor: 'rgba(56,189,248,0.2)'
          }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(56,189,248,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="school" size={18} color="#38BDF8" />
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
              <Ionicons name="terminal" size={18} color="#10B981" />
            </View>
            <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Código</Text>
            <Text style={{ color: textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 }}>
              {stats ? (stats as any).totalCodingExercises ?? 0 : '…'}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ 
            flex: 1, 
            backgroundColor: '#2D1A1E', 
            borderRadius: 24, 
            padding: 18,
            borderWidth: 1,
            borderColor: 'rgba(244,63,94,0.2)'
          }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(244,63,94,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="shield-checkmark" size={18} color="#F43F5E" />
            </View>
            <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Incidentes</Text>
            <Text style={{ color: textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 }}>
              {totalIncidents}
            </Text>
          </View>

          <View style={{ 
            flex: 1, 
            backgroundColor: '#1E1B2D', 
            borderRadius: 24, 
            padding: 18,
            borderWidth: 1,
            borderColor: 'rgba(139,92,246,0.2)'
          }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(139,92,246,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="server" size={18} color="#8B5CF6" />
            </View>
            <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Infraestrutura</Text>
            <Text style={{ color: textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 }}>
              {totalDataCenter}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content Layout */}
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24 }}>
        
        {/* Main Labs Column */}
        <View style={{ flex: isDesktop ? 3 : undefined }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="flask-outline" size={20} color="#A855F7" />
            </View>
            <View>
              <Text style={{ color: textPrimary, fontSize: 18, fontWeight: '800' }}>Laboratórios de TI</Text>
              <Text style={{ color: textMuted, fontSize: 12 }}>Aprenda na prática com cenários reais</Text>
            </View>
          </View>
          
          <View style={{ gap: 16 }}>
            {[
              {
                id: 'quiz',
                title: 'Quiz de Certificação',
                desc: 'Teste seus conhecimentos teóricos em Redes, Cloud, Segurança e mais. Sistema de repetição espaçada para fixação máxima.',
                icon: 'school',
                color: '#38BDF8',
                route: '/quiz'
              },
              {
                id: 'code',
                title: 'Prática de Código',
                desc: 'Domine a sintaxe de linguagens como TypeScript e Python montando blocos de código em desafios de lógica interativos.',
                icon: 'terminal',
                color: '#F59E0B',
                route: '/coding-practice'
              },
              {
                id: 'incidents',
                title: 'Gestão de Incidentes',
                desc: 'Resolva problemas críticos de infraestrutura sob pressão. Tome decisões rápidas para restaurar serviços e manter o SLA.',
                icon: 'shield-checkmark',
                color: '#F43F5E',
                route: '/quick-response'
              },
              {
                id: 'datacenter',
                title: 'Data Center Builder',
                desc: 'Simulador visual de montagem de racks. Aprenda cabeamento estruturado, conexões de fibra e organização de ativos.',
                icon: 'server',
                color: '#10B981',
                route: '/datacenter-builder'
              }
            ].map((lab) => (
              <TouchableOpacity
                key={lab.id}
                activeOpacity={0.7}
                onPress={() => router.push(lab.route as any)}
              >
                <PanelCard style={{ 
                  backgroundColor: surfaceColor, 
                  borderRadius: 24, 
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.05)',
                  shadowColor: lab.color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 2
                }}>
                  <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                    <View style={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 18, 
                      backgroundColor: lab.color + '15', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: lab.color + '25'
                    }}>
                      <Ionicons name={lab.icon as any} size={30} color={lab.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: textPrimary, fontSize: 18, fontWeight: '800' }}>{lab.title}</Text>
                      <Text style={{ color: textMuted, fontSize: 13, lineHeight: 20, marginTop: 4 }}>{lab.desc}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={textMuted + '40'} />
                  </View>
                </PanelCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Column */}
        <View style={{ flex: isDesktop ? 2 : undefined, gap: 24 }}>
          
          <PanelCard compact style={{ backgroundColor: surfaceColor, borderRadius: 24, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Ionicons name="rocket-outline" size={20} color="#F43F5E" />
              <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '700' }}>Como evoluir</Text>
            </View>
            <View style={{ gap: 16 }}>
              {[
                { icon: "school", text: "Quiz: Reforce a teoria com questões dinâmicas", color: "#38BDF8" },
                { icon: "terminal", text: "Código: Pratique lógica com desafios interativos", color: "#F59E0B" },
                { icon: "shield-checkmark", text: "Incidentes: Gerencie crises em cenários reais", color: "#F43F5E" },
                { icon: "server", text: "Infra: Simule a montagem física de um Data Center", color: "#10B981" }
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(99,102,241,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="diamond-outline" size={20} color="#6366F1" />
              </View>
              <View>
                <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '800' }}>Toolkit do Especialista</Text>
                <Text style={{ color: textMuted, fontSize: 11 }}>Ferramentas avançadas para o seu sucesso</Text>
              </View>
            </View>

            <View style={{ gap: 12 }}>
              {HOME_FEATURES.slice(0, 8).map((feature, index) => (
                <View key={index} style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  gap: 12,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  padding: 10,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.03)'
                }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name={feature.icon as any} size={16} color={textMuted} />
                  </View>
                  <Text style={{ flex: 1, color: '#D1D5DB', fontSize: 12, fontWeight: '500' }}>{feature.text}</Text>
                  <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.1)" />
                </View>
              ))}
            </View>

            <TouchableOpacity 
              activeOpacity={0.7}
              style={{ 
                marginTop: 20, 
                backgroundColor: 'rgba(99,102,241,0.1)', 
                paddingVertical: 12, 
                borderRadius: 12, 
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(99,102,241,0.2)'
              }}
            >
              <Text style={{ color: '#818CF8', fontSize: 13, fontWeight: '700' }}>Ver todos os recursos</Text>
            </TouchableOpacity>
          </PanelCard>

        </View>
      </View>
    </ScrollView>
  );
}
