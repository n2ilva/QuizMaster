/**
 * WorkbenchFab / WorkbenchValidateFab
 * -----------------------------------
 * Floating Action Buttons for the DataCenter Builder on mobile / small
 * screens.
 *
 * `WorkbenchFab` collapses the "Instalar", "Regras" e "Legenda" actions
 * (previously laid out in a horizontal toolbar strip) into a single circular
 * button anchored to the bottom-right corner of the workbench. Tapping the
 * button toggles a vertical speed-dial that lists each action as an
 * ícone + rótulo pill.
 *
 * `WorkbenchValidateFab` is a sibling single-action FAB (success-green)
 * that performs level validation. It is designed to sit BELOW the info FAB
 * (closer to the bottom edge, i.e. within easier thumb reach) while the
 * help FAB is offset upwards by its diameter + gap.
 *
 * Desktop keeps using the horizontal `WorkbenchToolbar`; both FABs are
 * rendered only when the parent tells it to (typically under
 * `isCompactChrome`).
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DC_COLORS } from "../datacenter-builder.constants";

/** Size + gap constants shared between the two FABs so the parent can
 *  stack them without guessing magic numbers. */
export const FAB_SIZE = 56;
export const FAB_STACK_GAP = 12;

export type FabAction = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

type WorkbenchFabProps = {
  actions: FabAction[];
  /**
   * Extra space above the tab bar / safe area. The parent passes the same
   * bottom inset used for the scroll container so the FAB hovers just above
   * any system chrome.
   */
  bottomInset?: number;
};

export function WorkbenchFab({ actions, bottomInset = 0 }: WorkbenchFabProps) {
  const [open, setOpen] = useState(false);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { bottom: 4 + bottomInset }]}
    >
      {/* Speed-dial items, rendered above the main button when open. */}
      {open ? (
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
                {
                  backgroundColor: hovered
                    ? DC_COLORS.bgSurfaceHover
                    : DC_COLORS.bgSurface,
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
      ) : null}

      {/* Main FAB button */}
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={open ? "Fechar menu de ajuda" : "Abrir menu de ajuda"}
        accessibilityState={{ expanded: open }}
        style={({ pressed }) => [
          styles.fab,
          { transform: [{ scale: pressed ? 0.94 : 1 }] },
        ]}
      >
        <MaterialIcons
          name={open ? "close" : "help-outline"}
          size={26}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    right: 16,
    alignItems: "flex-end",
    // Intentionally no background — the inner children carry their own.
  },
  menu: {
    marginBottom: 12,
    gap: 10,
    alignItems: "flex-end",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 14,
    paddingRight: 6,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
    letterSpacing: 0.2,
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
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DC_COLORS.accent,
    shadowColor: DC_COLORS.accent,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
    zIndex: 50,
  },
});

// ---------------------------------------------------------------------------
// WorkbenchValidateFab
// ---------------------------------------------------------------------------

type WorkbenchValidateFabProps = {
  onPress: () => void;
  /** Vertical distance from the bottom of the parent container. */
  bottomInset?: number;
};

/**
 * Single-action FAB that triggers scenario validation. Rendered as a sibling
 * of `WorkbenchFab`, typically anchored closer to the bottom edge so it
 * lands inside the thumb-friendly zone on phones.
 */
export function WorkbenchValidateFab({
  onPress,
  bottomInset = 0,
}: WorkbenchValidateFabProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Validar cenário"
      style={({ pressed }) => [
        validateStyles.fab,
        {
          bottom: 4 + bottomInset,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
      ]}
    >
      <MaterialIcons name="fact-check" size={26} color="#FFFFFF" />
    </Pressable>
  );
}

const validateStyles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DC_COLORS.success,
    shadowColor: DC_COLORS.success,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
