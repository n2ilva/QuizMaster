import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DC_COLORS } from "../datacenter-builder.constants";

export const FAB_SIZE = 58;
export const FAB_STACK_GAP = 12;

export type FabAction = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

type WorkbenchFabProps = {
  actions: FabAction[];
  bottomInset?: number;
};

export function WorkbenchFab({ actions, bottomInset = 0 }: WorkbenchFabProps) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.root,
        {
          bottom: 16 + bottomInset + insets.bottom,
        },
      ]}
    >
      {open && (
        <View style={styles.menu} pointerEvents="box-none">
          {actions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => {
                setOpen(false);
                action.onPress();
              }}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              style={({ hovered, pressed }) => [
                styles.item,
                getShadowStyle("#000"),
                {
                  backgroundColor:
                    Platform.OS === "web" && hovered
                      ? DC_COLORS.bgSurfaceHover
                      : DC_COLORS.bgSurface,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <Text style={styles.itemLabel} numberOfLines={1}>
                {action.label}
              </Text>

              <View style={styles.itemIconCircle}>
                <MaterialIcons
                  name={action.icon}
                  size={18}
                  color={DC_COLORS.accentSoft}
                />
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={
          open ? "Fechar menu de ajuda" : "Abrir menu de ajuda"
        }
        accessibilityState={{ expanded: open }}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <View style={[styles.fab, getShadowStyle(DC_COLORS.accent)]}>
          <MaterialIcons
            name={open ? "close" : "help-outline"}
            size={26}
            color="#FFFFFF"
          />
        </View>
      </Pressable>
    </View>
  );
}

/**
 * Sombra compatível com Web + Mobile
 */
function getShadowStyle(color: string): ViewStyle {
  if (Platform.OS === "web") {
    return {
      boxShadow: `0px 6px 14px ${hexToRgba(color, 0.4)}`,
    } as ViewStyle;
  }

  return {
    shadowColor: color,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
  };
}

/**
 * Converte HEX → RGBA (para web shadow)
 */
function hexToRgba(hex: string, alpha: number) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    right: 16,
    alignItems: "flex-end",
    zIndex: 999,
  },
  menu: {
    marginBottom: FAB_STACK_GAP,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 6,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
    marginBottom: 8, // substitui gap (mais seguro)
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
    marginRight: 8,
  },
  itemIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${DC_COLORS.accent}1F`,
    borderWidth: 1,
    borderColor: `${DC_COLORS.accent}55`,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DC_COLORS.accent,
    overflow: "hidden",
  },
});

/* ========================= */
/* FAB de validação melhorado */
/* ========================= */

type WorkbenchValidateFabProps = {
  onPress: () => void;
  bottomInset?: number;
};

export function WorkbenchValidateFab({
  onPress,
  bottomInset = 0,
}: WorkbenchValidateFabProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        validateStyles.root,
        {
          bottom: 16 + bottomInset + insets.bottom,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Validar cenário"
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <View style={[validateStyles.fab, getShadowStyle(DC_COLORS.success)]}>
          <MaterialIcons name="check" size={26} color="#FFFFFF" />
        </View>
      </Pressable>
    </View>
  );
}

const validateStyles = StyleSheet.create({
  root: {
    position: "absolute",
    right: 16,
    alignItems: "flex-end",
    zIndex: 999,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DC_COLORS.success,
    overflow: "hidden",
  },
});