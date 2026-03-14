import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { TRACK_STYLE_FALLBACK, trackStyles, type TrackIcon } from '@/constants/track-styles';
import { useStudyPlans } from '@/hooks/use-last-study-plan';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useTabContentPadding } from '@/hooks/use-tab-content-padding';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

type TrackCard = {
  key: string;
  label: string;
  icon: TrackIcon;
  color: string;
};

// ─── Dropdown de planos salvos ───────────────────────────────────────────
function PlansDropdown({
  plans,
  onSelect,
  onRemove,
  visible,
  onClose,
  anchorY,
  anchorX,
  anchorWidth,
}: {
  plans: { id: string; track: string; trackLabel: string; level: string; language?: string }[];
  onSelect: (plan: { track: string; level: string; language?: string }) => void;
  onRemove: (id: string) => void;
  visible: boolean;
  onClose: () => void;
  anchorY: number;
  anchorX: number;
  anchorWidth: number;
}) {
  if (!visible || plans.length === 0) return null;

  const windowWidth = Dimensions.get('window').width;
  const dropdownRight = windowWidth - (anchorX + anchorWidth);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View
          style={{
            position: 'absolute',
            top: anchorY + 4,
            right: dropdownRight,
            minWidth: Math.max(anchorWidth, 220),
            maxWidth: 320,
            backgroundColor: '#1A1D21',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#30363D',
            shadowColor: '#000',
            shadowOpacity: 0.4,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 10,
            overflow: 'hidden',
          }}>
          <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 }}>
            <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Planos salvos
            </Text>
          </View>
          {plans.map((p) => {
            const style = trackStyles[p.track] ?? TRACK_STYLE_FALLBACK;
            return (
              <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPress={() => { onSelect(p); onClose(); }}
                  style={({ pressed }) => ({
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 11,
                    backgroundColor: pressed ? '#252830' : 'transparent',
                  })}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: `${style.color}22`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <MaterialIcons name={style.icon} size={14} color={style.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '600' }}>
                      {p.trackLabel}
                    </Text>
                    <Text style={{ color: '#6B7280', fontSize: 11 }}>{p.level}</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => onRemove(p.id)}
                  style={({ pressed }) => ({
                    paddingHorizontal: 12,
                    paddingVertical: 11,
                    opacity: pressed ? 0.5 : 1,
                  })}>
                  <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
                </Pressable>
              </View>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

export default function ReadyCardsScreen() {
  const bottomPadding = useTabContentPadding();
  const { trackCatalog } = useData();
  const { isDesktop, isTablet } = useScreenSize();
  const router = useRouter();
  const { user } = useAuth();
  const { plans: savedPlans, removePlan, refresh } = useStudyPlans(user?.id);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const anchorRef = useRef<View>(null);
  const tracks: TrackCard[] = trackCatalog.map((item) => {
    const style = trackStyles[item.key] ?? TRACK_STYLE_FALLBACK;
    return {
      key: item.key,
      label: item.label,
      icon: style.icon,
      color: style.color,
    };
  });

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

        {/* Header desktop */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 26, fontWeight: '700' }}>Quiz</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 4 }}>
              Escolha como prefere estudar.
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/ready/planned' as never)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: pressed ? '#1e2a5e' : '#151C3A',
              borderWidth: 1,
              borderColor: '#3F51B5',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 10,
            })}>
            <MaterialIcons name="auto-awesome" size={16} color="#A5B4FC" />
            <Text style={{ color: '#A5B4FC', fontSize: 14, fontWeight: '700' }}>
              Criar Planejamento
            </Text>
          </Pressable>

          {savedPlans.length > 0 && (
            <View
              ref={anchorRef}
              style={{ marginLeft: 8 }}
              onLayout={() => {
                anchorRef.current?.measureInWindow((x, y, width, height) => {
                  setAnchorLayout({ x, y: y + height, width, height });
                });
              }}>
              <Pressable
                onPress={() => setDropdownOpen(true)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: pressed ? '#1A1D21' : 'transparent',
                  borderWidth: 1,
                  borderColor: '#22C55E40',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                })}>
                <MaterialIcons name="bookmark" size={16} color="#22C55E" />
                <Text style={{ color: '#22C55E', fontSize: 14, fontWeight: '700' }}>
                  Meus Planos
                </Text>
                <MaterialIcons name="arrow-drop-down" size={18} color="#22C55E" />
              </Pressable>
            </View>
          )}

          <PlansDropdown
            plans={savedPlans}
            visible={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            onSelect={(p) => {
              const langParam = p.language ? `&language=${p.language}` : '';
              router.push(`/ready/planned?resume=1&track=${p.track}&level=${p.level}${langParam}` as never);
            }}
            onRemove={removePlan}
            anchorY={anchorLayout.y}
            anchorX={anchorLayout.x}
            anchorWidth={anchorLayout.width}
          />
        </View>

        {/* Divider */}
        <View style={{ maxWidth: 720, width: '100%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
          <Text style={{ color: '#6B7280', fontSize: 12 }}>Todos os temas</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
        </View>

        {/* Grid 3 colunas — cards compactos estilo progresso */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[0, 1, 2].map((colIdx) => (
            <View key={colIdx} style={{ flex: 1, gap: 12 }}>
              {tracks.filter((_, i) => i % 3 === colIdx).map((t) => (
                <View
                  key={t.key}
                  style={{
                    backgroundColor: t.color,
                    borderRadius: 14,
                    padding: 2,
                    overflow: 'hidden',
                  }}>
                  <Link href={`/ready/${encodeURIComponent(t.key)}`} asChild>
                    <Pressable
                      style={({ pressed }) => ({
                        width: '100%',
                        height: 110,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: pressed ? '#17191C' : '#111316',
                        borderRadius: 12,
                        paddingHorizontal: 4,
                      })}>
                      <Text style={{ color: '#ECEDEE', fontSize: 17, fontWeight: '700', textAlign: 'center', padding: 10 }} numberOfLines={2}>
                        {t.label}
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              ))}
            </View>
          ))}
        </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#111316' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: bottomPadding }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#ECEDEE', fontSize: 24, fontWeight: '700' }}>Quiz</Text>
          <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>
            Escolha como prefere estudar.
          </Text>
        </View>
      </View>

      {/* Botões */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
        <Pressable
          onPress={() => router.push('/ready/planned' as never)}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: pressed ? '#1e2a5e' : '#151C3A',
            borderWidth: 1,
            borderColor: '#3F51B5',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          })}>
          <MaterialIcons name="auto-awesome" size={14} color="#A5B4FC" />
          <Text style={{ color: '#A5B4FC', fontSize: 13, fontWeight: '700' }}>
            Criar Planejamento
          </Text>
        </Pressable>

        {savedPlans.length > 0 && (
          <View
            ref={anchorRef}
            style={{ flex: 1 }}
            onLayout={() => {
              anchorRef.current?.measureInWindow((x, y, width, height) => {
                setAnchorLayout({ x, y: y + height, width, height });
              });
            }}>
            <Pressable
              onPress={() => setDropdownOpen(true)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                backgroundColor: pressed ? '#1A1D21' : 'transparent',
                borderWidth: 1,
                borderColor: '#22C55E40',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              })}>
              <MaterialIcons name="bookmark" size={14} color="#22C55E" />
              <Text style={{ color: '#22C55E', fontSize: 13, fontWeight: '600' }}>
                Meus Planos
              </Text>
              <MaterialIcons name="arrow-drop-down" size={16} color="#22C55E" />
            </Pressable>
          </View>
        )}
      </View>

      <PlansDropdown
        plans={savedPlans}
        visible={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        onSelect={(p) => {
          const langParam = p.language ? `&language=${p.language}` : '';
          router.push(`/ready/planned?resume=1&track=${p.track}&level=${p.level}${langParam}` as never);
        }}
        onRemove={removePlan}
        anchorY={anchorLayout.y}
        anchorX={anchorLayout.x}
        anchorWidth={anchorLayout.width}
      />

      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28, marginBottom: 16 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
        <Text style={{ color: '#6B7280', fontSize: 12 }}>Todos os temas</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#1E2328' }} />
      </View>

      {/* Grid 2 colunas */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[0, 1].map((colIdx) => (
          <View key={colIdx} style={{ flex: 1, gap: 10 }}>
            {tracks.filter((_, i) => i % 2 === colIdx).map((t) => (
              <View
                key={t.key}
                style={{
                  backgroundColor: t.color,
                  borderRadius: 14,
                  padding: 2,
                  overflow: 'hidden',
                }}>
                <Link href={`/ready/${encodeURIComponent(t.key)}`} asChild>
                  <Pressable
                    style={({ pressed }) => ({
                      width: '100%',
                      height: 80,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: pressed ? '#17191C' : '#111316',
                      borderRadius: 12,
                      paddingHorizontal: 4,
                    })}>
                    <Text style={{ color: '#ECEDEE', fontSize: 16, fontWeight: '700', textAlign: 'center', padding: 10 }} numberOfLines={2}>
                      {t.label}
                    </Text>
                  </Pressable>
                </Link>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

