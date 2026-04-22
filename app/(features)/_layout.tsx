import { Stack } from 'expo-router';

import { useLayoutMode } from '@/hooks/use-layout-mode';

export default function FeaturesLayout() {
  const layoutMode = useLayoutMode();
  const compactHeader = layoutMode !== 'desktop';

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#151718' } }}>
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen
        name="planning"
        options={{
          title: 'Planejamento de Estudos',
          headerBackTitle: 'Voltar',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="theme-info"
        options={{
          title: 'Pesquisa',
          headerBackTitle: 'Voltar',
          headerShown: compactHeader,
        }}
      />
    </Stack>
  );
}
