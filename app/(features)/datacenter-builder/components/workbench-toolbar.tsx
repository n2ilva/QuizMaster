import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DC_COLORS, DC_RADII } from "../datacenter-builder.constants";

type ToolbarAction = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  variant?: "default" | "primary" | "success" | "danger";
  disabled?: boolean;
};

type WorkbenchToolbarProps = {
  actions: ToolbarAction[];
  /** When true, only icons are shown (labels are used as accessibility only). */
  compact?: boolean;
};

/**
 * Floating action bar for the workbench — groups the tools (install, rules,
 * legend, validate…) in a single horizontally-scrollable strip. On compact
 * viewports the labels disappear to save space, but they stay accessible
 * through `accessibilityLabel`.
 */
export function WorkbenchToolbar({ actions, compact = false }: WorkbenchToolbarProps) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <ToolbarButton key={action.id} action={action} compact={compact} />
      ))}
    </View>
  );
}

function ToolbarButton({ action, compact }: { action: ToolbarAction; compact: boolean }) {
  const tone = VARIANT_STYLES[action.variant ?? "default"];

  return (
    <Pressable
      onPress={action.onPress}
      disabled={action.disabled}
      accessibilityRole="button"
      accessibilityLabel={action.label}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.96 : 1 }],
          opacity: action.disabled ? 0.4 : 1,
        }
      ]}
    >
      <View style={[
        styles.button,
        compact && styles.buttonCompact,
        {
          backgroundColor: tone.bg,
          borderColor: tone.border,
        }
      ]}>
        <MaterialIcons name={action.icon} size={compact ? 20 : 18} color={tone.fg} />
        {!compact && (
          <Text style={[styles.label, { color: tone.fg }]} numberOfLines={1}>
            {action.label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const VARIANT_STYLES = {
  default: {
    bg: DC_COLORS.bgSurface,
    bgHover: DC_COLORS.bgSurfaceHover,
    border: DC_COLORS.borderMuted,
    fg: DC_COLORS.textSecondary,
  },
  primary: {
    bg: `${DC_COLORS.accent}1A`,
    bgHover: `${DC_COLORS.accent}33`,
    border: `${DC_COLORS.accent}66`,
    fg: DC_COLORS.accentSoft,
  },
  success: {
    bg: DC_COLORS.success,
    bgHover: "#16A34A",
    border: DC_COLORS.success,
    fg: "#FFFFFF",
  },
  danger: {
    bg: `${DC_COLORS.danger}1A`,
    bgHover: `${DC_COLORS.danger}33`,
    border: `${DC_COLORS.danger}66`,
    fg: DC_COLORS.danger,
  },
} as const;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    padding: 10,
    backgroundColor: DC_COLORS.bgPanel,
    borderRadius: DC_RADII.lg,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: DC_RADII.md,
    borderWidth: 1,
    minWidth: 40,
    justifyContent: "center",
  },
  buttonCompact: {
    width: 40,
    paddingHorizontal: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
