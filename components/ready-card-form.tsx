import { Text, View } from 'react-native';

export function ReadyCardForm() {
  return (
    <View className="mt-8 rounded-2xl border border-[#E6E8EB] p-4 dark:border-[#30363D]">
      <Text className="text-lg font-semibold text-[#11181C] dark:text-[#ECEDEE]">
        Criar novo Quiz
      </Text>
      <Text className="mt-1 text-sm text-[#687076] dark:text-[#9BA1A6]">
        Esse quiz vai direto para a base QuizMaster.
      </Text>

      <View className="mt-6 min-h-[120px] items-center justify-center">
        <Text className="text-center text-base text-[#687076] dark:text-[#9BA1A6]">
          Em breve.
        </Text>
      </View>
    </View>
  );
}
