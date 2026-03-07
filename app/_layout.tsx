import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { LoadingScreen } from '@/components/loading-screen';
import { useStudyReminders } from '@/hooks/use-study-reminders';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { DataProvider, useData } from '@/providers/data-provider';

if (Platform.OS !== 'web') {
  Appearance.setColorScheme('dark');
}

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { isPreloading, preloadProgress } = useData();

  // Agenda notificações de lembrete de estudo (12h e 18h)
  useStudyReminders(!!user);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const onLoginRoute = pathname === '/login';

    if (!user && !onLoginRoute) {
      router.replace('/login');
      return;
    }

    if (user && onLoginRoute) {
      router.replace('/(tabs)');
    }
  }, [isLoading, pathname, router, user]);

  // Show loading screen while auth is resolving or data is preloading
  if (isLoading || (user && isPreloading)) {
    return <LoadingScreen progress={isLoading ? 0 : preloadProgress} />;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          contentStyle: { backgroundColor: 'transparent' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="ready/[track]"
          options={{
            title: 'Categorias',
            headerBackTitle: 'Voltar',
          }}
        />
        <Stack.Screen
          name="ready/study"
          options={{
            title: 'Estudo',
            headerBackTitle: 'Voltar',
          }}
        />
        <Stack.Screen
          name="ready/theme-info"
          options={{
            title: 'Pesquisa',
            headerBackTitle: 'Voltar',
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <RootNavigator />
      </DataProvider>
    </AuthProvider>
  );
}
