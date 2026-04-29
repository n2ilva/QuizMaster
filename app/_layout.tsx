import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance, Platform, StyleSheet, View } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Disables the 'Reading from value during component render' warning
// common in Reanimated 4 with third-party libraries.
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { LoadingScreen } from '@/components/ui/loading-screen';
import { useLayoutMode } from '@/hooks/use-layout-mode';
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
  anchor: '(features)',
};

function RootNavigator() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { isPreloading, preloadProgress } = useData();
  const isInitializing = isLoading;

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
      router.replace('/(features)/(main)');
    }
  }, [isLoading, pathname, router, user]);

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
        <Stack.Screen name="(features)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
      {isInitializing && (
        <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
          <LoadingScreen progress={0} />
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
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <RootNavigator />
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
