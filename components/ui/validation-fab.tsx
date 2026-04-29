import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Platform,
  ViewStyle,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ValidationFabProps = {
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  /** Extra bottom offset added ON TOP of the safe-area inset (default 16). */
  bottomInset?: number;
};

const FAB_SIZE = 58;

/**
 * Botão FAB flutuante padronizado para validação de exercícios.
 *
 * Padrão visual unificado para **todos** os jogos:
 * - Redondo (58 dp)
 * - Verde (#10B981)
 * - Canto inferior direito
 * - Flutuante (position: absolute)
 */
export function ValidationFab({
  onPress,
  disabled = false,
  icon = 'check',
  bottomInset = 16,
}: ValidationFabProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.root,
        {
          bottom: bottomInset + insets.bottom,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Validar exercício"
        style={({ pressed }) => [
          {
            opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
            transform: [{ scale: pressed && !disabled ? 0.96 : 1 }],
          },
        ]}
      >
        <View style={[styles.fab, getShadowStyle()]}>
          <MaterialIcons name={icon} size={26} color="#FFFFFF" />
        </View>
      </Pressable>
    </View>
  );
}

/**
 * Sombra cross-platform
 */
function getShadowStyle(): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      boxShadow: '0px 6px 14px rgba(16, 185, 129, 0.4)',
    } as ViewStyle;
  }

  return {
    shadowColor: '#10B981',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
  };
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 24,
    alignItems: 'flex-end',
    zIndex: 9999,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
  },
});