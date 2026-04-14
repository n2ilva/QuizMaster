import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePathname, useRouter } from 'expo-router';
import { type ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

type NavItem = {
  href: string;
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
};

const navItems: NavItem[] = [
  { href: '/(features)/(main)', label: 'Início', icon: 'house' },
  { href: '/(features)/(main)/coding-practice', label: 'Praticar', icon: 'extension' },
  { href: '/(features)/(main)/quiz', label: 'Quiz', icon: 'library-books' },
  { href: '/(features)/(main)/progress', label: 'Progresso', icon: 'bar-chart' },
  { href: '/(features)/(main)/community', label: 'Comunidade', icon: 'groups' },
];

export function DesktopSidebar({ onLogout = () => undefined }: { onLogout?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  function isActive(href: string) {
    if (href === '/(features)/(main)') return pathname === '/' || pathname === '/index';
    return pathname.startsWith(href.replace('/(features)/(main)', ''));
  }

  return (
    <View
      style={{
        width: 240,
        height: '100%',
        backgroundColor: '#0D0F10',
        borderRightWidth: 1,
        borderRightColor: '#1E2328',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}>
      {/* Logo */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/(features)/(main)' as never)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 8,
          marginBottom: 32,
          opacity: pressed ? 0.85 : 1,
        })}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: '#3F51B5',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name="style" size={20} color="#FFFFFF" />
        </View>
        <Text style={{ color: '#ECEDEE', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 }}>
          QuizMaster
        </Text>
      </Pressable>

      {/* Navigation */}
      <View style={{ gap: 4, flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as never)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 12,
                paddingVertical: 11,
                borderRadius: 10,
                backgroundColor: active
                  ? 'rgba(63,81,181,0.18)'
                  : pressed
                    ? 'rgba(255,255,255,0.05)'
                    : 'transparent',
                borderLeftWidth: 3,
                borderLeftColor: active ? '#A5B4FC' : 'transparent',
              })}>
              <MaterialIcons
                name={item.icon}
                size={20}
                color={active ? '#A5B4FC' : '#6B7280'}
              />
              <Text
                style={{
                  color: active ? '#A5B4FC' : '#9BA1A6',
                  fontSize: 14,
                  fontWeight: active ? '600' : '400',
                }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* User footer */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#1E2328',
          paddingTop: 16,
          gap: 12,
        }}>
        {user && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#3F51B5',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, overflow: 'hidden' }}>
              <Text
                style={{ color: '#ECEDEE', fontSize: 13, fontWeight: '600' }}
                numberOfLines={1}>
                {user.name}
              </Text>
              <Text
                style={{ color: '#687076', fontSize: 11 }}
                numberOfLines={1}>
                {user.email}
              </Text>
            </View>
          </View>
        )}

        <Pressable
          onPress={onLogout}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 12,
            paddingVertical: 9,
            borderRadius: 10,
            backgroundColor: pressed ? 'rgba(239,68,68,0.1)' : 'transparent',
          })}>
          <MaterialIcons name="logout" size={18} color="#6B7280" />
          <Text style={{ color: '#6B7280', fontSize: 13, fontWeight: '500' }}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}
