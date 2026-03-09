import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useIsDesktop } from '@/hooks/use-is-desktop';

export default function ReadyThemeInfoScreen() {
  const router = useRouter();
  const { track, category } = useLocalSearchParams<{ track: string; category: string }>();
  const contextLabel = `Tema: ${track ?? ''} · Categoria: ${category ?? ''}`.toLocaleUpperCase('pt-BR');
  const isDesktopWidth = useIsDesktop();

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]" showsVerticalScrollIndicator={false}>
      {isDesktopWidth && (
        <Pressable
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, alignSelf: 'flex-start' }}>
          <MaterialIcons name="arrow-back" size={18} color="#687076" />
          <Text style={{ color: '#687076', fontSize: 14 }}>Voltar</Text>
        </Pressable>
      )}
      <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">Pesquisa de categoria</Text>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">{contextLabel}</Text>

      <View className="mt-5 gap-3 pb-8">
        <View className="rounded-2xl border border-[#E6E8EB] p-4 dark:border-[#30363D]">
          <Text className="text-base font-semibold text-[#11181C] dark:text-[#ECEDEE]">O que é</Text>
          <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">Em breve.</Text>
        </View>

        <View className="rounded-2xl border border-[#E6E8EB] p-4 dark:border-[#30363D]">
          <Text className="text-base font-semibold text-[#11181C] dark:text-[#ECEDEE]">Como é aplicada</Text>
          <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">Em breve.</Text>
        </View>

        <View className="rounded-2xl border border-[#E6E8EB] p-4 dark:border-[#30363D]">
          <Text className="text-base font-semibold text-[#11181C] dark:text-[#ECEDEE]">Exemplo básico</Text>
          <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">Em breve.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

