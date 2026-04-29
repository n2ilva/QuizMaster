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

/**
 * Cor azul para o FAB de ajuda — diferencia do ValidationFab (verde).
 */
const FAB_BLUE = "#3B82F6";

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

/**
 * FAB de menu flutuante para ações de ajuda no DataCenter Builder.
 *
 * Padrão visual alinhado com o ValidationFab:
 * - Redondo (58 dp)
 * - Azul (#3B82F6)
 * - Canto inferior direito (right: 24)
 * - Flutuante (position: absolute)
 *
 * Os estilos visuais ficam no inner View para evitar bugs de
 * renderização do Pressable no mobile (gap, hover, backgroundColor).
 */
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
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                  marginBottom: 8,
                },
              ]}
            >
              <View style={[styles.item, getMenuItemShadow()]}>
                <Text style={styles.itemLabel} numberOfLines={1}>
                  {action.label}
                </Text>

                <View style={styles.itemIconCircle}>
                  <MaterialIcons
                    name={action.icon}
                    size={18}
                    color={FAB_BLUE}
                  />
                </View>
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
        <View style={[styles.fab, getFabShadow()]}>
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
 * Sombra do FAB principal (azul)
 */
function getFabShadow(): ViewStyle {
  if (Platform.OS === "web") {
    return {
      boxShadow: "0px 6px 14px rgba(59, 130, 246, 0.4)",
    } as ViewStyle;
  }

  return {
    shadowColor: FAB_BLUE,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
  };
}

/**
 * Sombra dos itens do menu (sutil)
 */
function getMenuItemShadow(): ViewStyle {
  if (Platform.OS === "web") {
    return {
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    } as ViewStyle;
  }

  return {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  };
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    right: 24,
    alignItems: "flex-end",
    zIndex: 9999,
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
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#1A1D21",
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ECEDEE",
    marginRight: 8,
  },
  itemIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${FAB_BLUE}1F`,
    borderWidth: 1,
    borderColor: `${FAB_BLUE}55`,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: FAB_BLUE,
    overflow: "hidden",
  },
});