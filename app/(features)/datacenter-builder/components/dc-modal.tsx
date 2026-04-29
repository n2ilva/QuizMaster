import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import { DC_BREAKPOINTS, DC_COLORS, DC_RADII } from "../datacenter-builder.constants";

type DcModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  tone?: "default" | "danger" | "warning" | "success";
  children: React.ReactNode;
  /** Primary action button (e.g. "Entendi", "Validar novamente"). */
  primaryAction?: { label: string; onPress: () => void };
  /** Secondary/cancel action. Hidden if omitted. */
  secondaryAction?: { label: string; onPress: () => void };
};

/**
 * Standardized modal shell used across the datacenter builder.
 * - Overlay blur + centered card on desktop
 * - Full-width sheet on narrow viewports
 * - Always has an accessible close affordance in the header
 */
export function DcModal({
  visible,
  onClose,
  title,
  subtitle,
  icon,
  tone = "default",
  children,
  primaryAction,
  secondaryAction,
}: DcModalProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < DC_BREAKPOINTS.compactChrome;
  const toneColor = TONE_COLORS[tone];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar">
        <Pressable
          onPress={() => {}}
          style={[
            styles.card,
            isCompact ? styles.cardCompact : styles.cardWide,
          ]}
        >
          <View style={styles.header}>
            {icon && (
              <View style={[styles.iconWrap, { backgroundColor: `${toneColor}1F` }]}>
                <MaterialIcons name={icon} size={22} color={toneColor} />
              </View>
            )}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={styles.subtitle} numberOfLines={3}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.94 : 1 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Fechar modal"
              hitSlop={8}
            >
              <View style={[styles.closeBtn, { backgroundColor: DC_COLORS.bgSurface }]}>
                <MaterialIcons name="close" size={18} color={DC_COLORS.textSecondary} />
              </View>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            style={styles.scroll}
          >
            {children}
          </ScrollView>

          {(primaryAction || secondaryAction) && (
            <View style={styles.footer}>
              {secondaryAction && (
                <Pressable
                  onPress={secondaryAction.onPress}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={secondaryAction.label}
                >
                  <View style={[styles.footerBtn, styles.secondaryBtn]}>
                    <Text style={styles.secondaryText}>{secondaryAction.label}</Text>
                  </View>
                </Pressable>
              )}
              {primaryAction && (
                <Pressable
                  onPress={primaryAction.onPress}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={primaryAction.label}
                >
                  <View style={[styles.footerBtn, { backgroundColor: DC_COLORS.accent }]}>
                    <Text style={styles.primaryText}>{primaryAction.label}</Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const TONE_COLORS = {
  default: DC_COLORS.accent,
  danger: DC_COLORS.danger,
  warning: DC_COLORS.warning,
  success: DC_COLORS.success,
} as const;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4,6,10,0.82)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: DC_COLORS.bgPanel,
    borderRadius: DC_RADII.xl,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
    overflow: "hidden",
    maxHeight: "92%",
  },
  cardWide: {
    width: "100%",
    maxWidth: 520,
  },
  cardCompact: {
    width: "100%",
    maxWidth: 520,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: DC_COLORS.borderSubtle,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: DC_RADII.md,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: DC_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  subtitle: {
    color: DC_COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: DC_RADII.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
  },
  scroll: {
    flexGrow: 0,
  },
  content: {
    padding: 18,
    gap: 12,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: DC_COLORS.borderSubtle,
    backgroundColor: DC_COLORS.bgPanelInset,
  },
  footerBtn: {
    width: "100%",
    height: 44,
    borderRadius: DC_RADII.md,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: DC_COLORS.borderStrong,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  secondaryText: {
    color: DC_COLORS.textMuted,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
