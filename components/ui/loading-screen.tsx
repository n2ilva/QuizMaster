import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>QMaster</Text>
      <Text style={styles.subtitle}>Preparando tudo para você...</Text>

      <View style={styles.trackBar}>
        <Animated.View
          style={[styles.progressBar, { width: widthInterpolated }]}
        />
      </View>

      <Text style={styles.percent}>{Math.round(progress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151718',
  },
  title: {
    marginBottom: 8,
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginBottom: 32,
    fontSize: 16,
    color: '#9CA3AF',
  },
  trackBar: {
    height: 8,
    width: 256,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#374151',
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6366F1',
  },
  percent: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});
