/**
 * DeviceManual
 * ------------
 * Renders the "manual" of the currently consoled device: the list of CLI
 * sections, their descriptions and the exact commands the user is expected
 * to type into `DeviceTerminal`. Sections whose `validation_token` has
 * already been captured by the parent screen are rendered as complete.
 *
 * The manual is a read-only reference panel. All typing happens inside
 * `DeviceTerminal`; this component only exists so the user has somewhere
 * to look at the expected configuration while typing.
 *
 * Responsive: a horizontal list of section cards that wraps naturally.
 * On stacked (mobile) layout the panel sits above the workbench canvas,
 * inside the same outer ScrollView, so it scrolls along with the rack.
 */

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { DC_COLORS, DC_RADII } from "../datacenter-builder.constants";
import type { CliConfigSection, InventoryDevice } from "../datacenter-builder.types";

// On web, hide the native scrollbar while keeping scroll behaviour.
// On native, these keys are ignored by the style system.
const webHideScrollbar =
  Platform.OS === "web"
    ? ({
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      } as const)
    : null;

// Chrome/Safari need a ::-webkit-scrollbar rule in addition to
// `scrollbar-width: none`. Inject a single <style> tag once.
if (Platform.OS === "web" && typeof document !== "undefined") {
  const STYLE_ID = "dc-manual-hide-scrollbar";
  if (!document.getElementById(STYLE_ID)) {
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = `
      [data-dc-manual-scroll]::-webkit-scrollbar { display: none; width: 0; height: 0; }
    `;
    document.head.appendChild(el);
  }
}

type Props = {
  device: InventoryDevice;
  /** Tokens the user has already completed for this device. */
  completedTokens: ReadonlySet<string>;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

function dialectHint(device: InventoryDevice): string {
  switch (device.cli_dialect) {
    case "cisco_ios":
      return "Cisco IOS — use `enable` e `configure terminal` antes de aplicar os comandos.";
    case "mikrotik":
      return "MikroTik RouterOS — comandos começam com `/` (ex.: `/ip address add`).";
    case "linux":
      return "Linux shell — comandos padrão de sistema, execute com privilégio quando necessário.";
    default:
      return "Digite cada comando exatamente como listado. Use `?` ou `help` no terminal para ajuda.";
  }
}

function SectionCard({
  section,
  index,
  completed,
}: {
  section: CliConfigSection;
  index: number;
  completed: boolean;
}) {
  return (
    <View
      style={[
        styles.sectionCard,
        completed && styles.sectionCardDone,
      ]}
    >
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionBadge,
            completed && styles.sectionBadgeDone,
          ]}
        >
          {completed ? (
            <MaterialIcons name="check" size={14} color="#0b2b14" />
          ) : (
            <Text style={styles.sectionBadgeText}>{index + 1}</Text>
          )}
        </View>
        <Text style={styles.sectionTitle} numberOfLines={2}>
          {section.section}
        </Text>
      </View>

      {section.description ? (
        <Text style={styles.sectionDesc}>{section.description}</Text>
      ) : null}

      <View style={styles.commandList}>
        {section.commands.map((cmd, i) => (
          <View key={`${index}-${i}`} style={styles.commandRow}>
            <Text style={styles.commandPrompt}>$</Text>
            <Text style={styles.commandText} selectable>
              {cmd}
            </Text>
          </View>
        ))}
      </View>

      {section.validation_token ? (
        <Text style={styles.sectionFooter}>
          token: <Text style={styles.sectionToken}>{section.validation_token}</Text>
        </Text>
      ) : null}
    </View>
  );
}

export function DeviceManual({
  device,
  completedTokens,
  collapsed,
  onToggleCollapsed,
}: Props) {
  const sections = device.cli_config ?? [];
  const [activePage, setActivePage] = useState(0);

  const doneCount = sections.filter(
    (s) => s.validation_token && completedTokens.has(s.validation_token),
  ).length;

  // Reset page when device changes
  useEffect(() => {
    setActivePage(0);
  }, [device.id]);

  const totalPages = sections.length;

  return (
    <View style={styles.container}>
      <Pressable onPress={onToggleCollapsed}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="book-open-variant" size={18} color={DC_COLORS.textPrimary} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.title} numberOfLines={1}>
              Manual · {device.label ?? device.id}
            </Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {dialectHint(device)}
            </Text>
          </View>
          {sections.length > 0 ? (
            <View style={styles.headerInfo}>
              <View style={styles.progressPill}>
                <Text style={styles.progressPillText}>
                  {doneCount}/{sections.length}
                </Text>
              </View>
              <View style={styles.stepIndicator}>
                {sections.map((_, i) => (
                  <View
                    key={`dot-${i}`}
                    style={[
                      styles.stepDot,
                      i === activePage && styles.stepDotActive,
                      i < activePage && styles.stepDotDone,
                      !!sections[i].validation_token && completedTokens.has(sections[i].validation_token!) && styles.stepDotDone,
                    ]}
                  />
                ))}
              </View>
            </View>
          ) : null}
          <MaterialIcons
            name={collapsed ? "expand-more" : "expand-less"}
            size={22}
            color={DC_COLORS.textSecondary}
          />
        </View>
      </Pressable>

      {!collapsed ? (
        sections.length === 0 ? (
          <Text style={styles.empty}>
            Este equipamento não exige configuração via CLI neste cenário.
          </Text>
        ) : (
          <View style={styles.pagedContent}>
            <ScrollView
              style={[styles.sectionsScroll, webHideScrollbar as any]}
              contentContainerStyle={styles.sectionsWrap}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              {...(Platform.OS === "web"
                ? ({ dataSet: { "dc-manual-scroll": "true" } } as any)
                : null)}
            >
              <SectionCard
                section={sections[activePage]}
                index={activePage}
                completed={
                  !!sections[activePage].validation_token && 
                  completedTokens.has(sections[activePage].validation_token!)
                }
              />
            </ScrollView>

            {/* Navigation Footer */}
            <View style={styles.footer}>
              <Pressable
                disabled={activePage === 0}
                onPress={() => setActivePage(p => p - 1)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <View style={[styles.navButton, activePage === 0 && styles.navButtonDisabled]}>
                  <MaterialIcons name="chevron-left" size={20} color={activePage === 0 ? DC_COLORS.textFaint : DC_COLORS.textPrimary} />
                  <Text style={[styles.navButtonText, activePage === 0 && { color: DC_COLORS.textFaint }]}>Anterior</Text>
                </View>
              </Pressable>

              <Pressable
                disabled={activePage === totalPages - 1}
                onPress={() => setActivePage(p => p + 1)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <View style={[styles.navButton, styles.navButtonPrimary, activePage === totalPages - 1 && styles.navButtonDisabled]}>
                  <Text style={styles.navButtonTextPrimary}>Próximo</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DC_COLORS.bgSurface,
    borderRadius: DC_RADII.lg,
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 14,
    color: DC_COLORS.textSecondary,
    marginTop: 1,
  },
  headerInfo: {
    alignItems: 'flex-end',
    gap: 6,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 3,
  },
  stepDot: {
    width: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: DC_COLORS.borderMuted,
  },
  stepDotActive: {
    backgroundColor: DC_COLORS.accent,
    width: 18,
  },
  stepDotDone: {
    backgroundColor: DC_COLORS.success,
  },
  progressPill: {
    backgroundColor: DC_COLORS.bgSurfaceHover,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
  },
  progressPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
  },
  empty: {
    fontSize: 13,
    color: DC_COLORS.textSecondary,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  pagedContent: {
    flex: 1,
  },
  sectionsScroll: {
    flex: 1,
  },
  sectionsWrap: {
    flexDirection: "column",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: DC_COLORS.borderSubtle,
    backgroundColor: DC_COLORS.bgSurface,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: DC_RADII.md,
    gap: 2,
  },
  navButtonPrimary: {
    backgroundColor: DC_COLORS.accent,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
  },
  navButtonTextPrimary: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  sectionCard: {
    width: "100%",
    alignSelf: "stretch",
    backgroundColor: DC_COLORS.bgSurfaceHover,
    borderRadius: DC_RADII.md,
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
    padding: 12,
    gap: 8,
    minHeight: 140,
  },
  sectionCardDone: {
    borderColor: "#2f9e5c",
    backgroundColor: "rgba(47, 158, 92, 0.08)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionBadge: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: DC_COLORS.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionBadgeDone: {
    backgroundColor: "#4ade80",
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 16,
    color: DC_COLORS.textSecondary,
  },
  commandList: {
    gap: 4,
  },
  commandRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  commandPrompt: {
    fontFamily: "Menlo",
    fontSize: 12,
    color: DC_COLORS.textFaint,
    lineHeight: 18,
  },
  commandText: {
    flex: 1,
    fontFamily: "Menlo",
    fontSize: 12,
    lineHeight: 18,
    color: DC_COLORS.textPrimary,
  },
  sectionFooter: {
    fontSize: 11,
    color: DC_COLORS.textFaint,
  },
  sectionToken: {
    fontFamily: "Menlo",
    color: DC_COLORS.textSecondary,
  },
});
