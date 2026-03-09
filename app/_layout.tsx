import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance, Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { LoadingScreen } from '@/components/ui/loading-screen';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useStudyReminders } from '@/hooks/use-study-reminders';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { DataProvider, useData } from '@/providers/data-provider';

if (Platform.OS !== 'web') {
  Appearance.setColorScheme('dark');
}

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if the splash screen was already handled by the runtime.
});

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const { user, isLoading } = useAuth();
  const { isPreloading, preloadProgress } = useData();
  const isInitializing = isLoading || (user != null && isPreloading);

  // Agenda notificações de lembrete de estudo (12h e 18h)
  useStudyReminders(!!user);

  useEffect(() => {
    if (isLoading || (user && isPreloading)) {
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
  }, [isLoading, isPreloading, pathname, router, user]);

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    void SplashScreen.hideAsync().catch(() => {
      // Ignore if the splash screen is already hidden.
    });
  }, [isInitializing]);

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          contentStyle: { backgroundColor: '#151718' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="ready/[track]"
          options={{
            title: 'Categorias',
            headerBackTitle: 'Voltar',
            headerShown: !isDesktop,
          }}
        />
        <Stack.Screen
          name="ready/study"
          options={{
            title: 'Quizzes',
            headerBackTitle: 'Voltar',
            headerShown: !isDesktop,
          }}
        />
        <Stack.Screen
          name="ready/theme-info"
          options={{
            title: 'Pesquisa',
            headerBackTitle: 'Voltar',
            headerShown: !isDesktop,
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
      {isInitializing && (
        <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
          <LoadingScreen progress={isLoading ? 0 : preloadProgress} />
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    backgroundColor: '#151718',
  },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <RootNavigator />
      </DataProvider>
    </AuthProvider>
  );
}
