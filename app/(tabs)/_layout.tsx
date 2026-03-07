import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';

import { DesktopSidebar } from '@/components/desktop-sidebar';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useAuth } from '@/providers/auth-provider';

function DesktopTabLayout() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logout();
      router.replace('/login');
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#0D0F10' }}>
      <DesktopSidebar onLogout={() => void handleLogout()} />
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Tabs
          screenOptions={{
            sceneStyle: { flex: 1 },
            tabBarActiveTintColor: Colors.dark.tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: { display: 'none' },
          }}>
          <Tabs.Screen name="index" options={{ title: 'Início' }} />
          <Tabs.Screen name="ready" options={{ title: 'Quiz' }} />
          <Tabs.Screen name="progress" options={{ title: 'Progresso' }} />
          <Tabs.Screen name="community" options={{ title: 'Comunidade' }} />
        </Tabs>
      </View>
    </View>
  );
}

function MobileTabLayout() {
  return (
    <Tabs
      screenOptions={{
        sceneStyle: { flex: 1 },
        tabBarActiveTintColor: Colors.dark.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#151718',
          borderTopColor: '#30363D',
          borderTopWidth: 1,
          ...(Platform.OS === 'web' && {
            height: 64,
            paddingBottom: 8,
            paddingTop: 6,
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ready"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Comunidade',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.sequence.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return <DesktopTabLayout />;
  }

  return <MobileTabLayout />;
}
