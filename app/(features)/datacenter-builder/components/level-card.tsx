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

        {level.tier && (
          <Text style={styles.tier} numberOfLines={1}>
            {level.tier}
          </Text>
        )}
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
    flexGrow: 1,
    flexBasis: 220,
    padding: 16,
    borderRadius: DC_RADII.xl,
    borderWidth: 1,
    gap: 8,
    minHeight: 160,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DC_RADII.pill,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  doneWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  tier: {
    color: DC_COLORS.accentSoft,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  name: {
    color: DC_COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  description: {
    color: DC_COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: DC_COLORS.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  glyph: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "900",
  },
});
