import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

type LoadingScreenProps = {
  progress: number;
};

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 items-center justify-center bg-[#151718]">
      <Text className="mb-2 text-3xl font-bold text-white">QuizMaster</Text>
      <Text className="mb-8 text-base text-gray-400">Preparando tudo para você...</Text>

      <View className="h-2 w-64 overflow-hidden rounded-full bg-gray-700">
        <Animated.View
          style={{ width: widthInterpolated }}
          className="h-full rounded-full bg-indigo-500"
        />
      </View>

      <Text className="mt-3 text-sm text-gray-500">{Math.round(progress)}%</Text>
    </View>
  );
}
