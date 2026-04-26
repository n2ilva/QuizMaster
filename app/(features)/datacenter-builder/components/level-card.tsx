import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DC_COLORS, DC_DIFFICULTY, DC_RADII } from "../datacenter-builder.constants";
import type { DataCenterLevel } from "../datacenter-builder.types";

type LevelCardProps = {
  level: DataCenterLevel;
  completed: boolean;
  onPress: () => void;
};

/**
 * Card used in the level-selection grid. Renders the tier badge, name,
 * difficulty marker and a completion indicator.
 */
export function LevelCard({ level, completed, onPress }: LevelCardProps) {
  const diff = DC_DIFFICULTY[level.difficulty] ?? DC_DIFFICULTY.easy;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Selecionar nível ${level.name}`}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[
        styles.card,
        {
          borderColor: completed ? `${DC_COLORS.success}66` : DC_COLORS.borderMuted,
          backgroundColor: DC_COLORS.bgPanel,
        }
      ]}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: diff.soft }]}>
            <Text style={[styles.badgeText, { color: diff.color }]}>{diff.label}</Text>
          </View>
          {completed && (
            <View style={styles.doneWrap}>
              <MaterialIcons name="check-circle" size={18} color={DC_COLORS.success} />
            </View>
          )}
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {level.name}
        </Text>

        {level.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {level.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <MaterialIcons name="memory" size={14} color={DC_COLORS.textMuted} />
            <Text style={styles.metaText}>{level.inventory?.length ?? 0} equip.</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="cable" size={14} color={DC_COLORS.textMuted} />
            <Text style={styles.metaText}>{level.connections_required?.length ?? 0} conex.</Text>
          </View>
          <View style={[styles.metaItem, { marginLeft: "auto" }]}>
            <Text style={[styles.glyph, { color: diff.color }]}>{diff.glyph}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, // Allow card to grow
    minWidth: 150, // Minimum safety for small screens
    padding: 20,
    borderRadius: DC_RADII.xl,
    borderWidth: 1,
    gap: 12,
    minHeight: 180,
    backgroundColor: DC_COLORS.bgPanel,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: DC_RADII.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  doneWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(34,197,94,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.2)",
  },
  tier: {
    color: DC_COLORS.accentSoft,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  name: {
    color: DC_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  description: {
    color: DC_COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DC_COLORS.borderSubtle,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    color: DC_COLORS.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },
  glyph: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "900",
    opacity: 0.7,
  },
});
