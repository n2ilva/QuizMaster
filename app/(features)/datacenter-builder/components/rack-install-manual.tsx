/**
 * RackInstallManual
 * -----------------
 * Manual completo de instalação para o modo "rack" em telas pequenas.
 * Mostrado abaixo do rack quando a visualização compacta está ativa.
 *
 * Inclui:
 *  - Sequência de instalação (cada equipamento, ordem e posição em U).
 *  - Tabela de cabeamento (quais cabos vão em cada porta, de/para).
 *  - Passo a passo geral de operação (instalar, cabear, validar).
 *
 * É um painel somente-leitura. O usuário continua interagindo diretamente
 * com o rack (clicar em slots e portas); este painel apenas descreve o que
 * precisa ser feito.
 */

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DC_CABLE_VISUALS, DC_COLORS, DC_RADII } from "../datacenter-builder.constants";
import { getDeviceIcon } from "../datacenter-builder.helpers";
import type {
    DataCenterLevel,
    InventoryDevice,
    RequiredConnection,
} from "../datacenter-builder.types";

type Props = {
  level: DataCenterLevel;
  installedDevices: Record<number, InventoryDevice>;
};

function normalizeKey(key: string): string {
  return key === "laptop.serial" ? "laptop.console" : key;
}

function portLabel(device: InventoryDevice | undefined, portId: string): string {
  if (!device) return portId;
  const port = device.ports.find((p) => p.id === portId);
  return port?.label ?? port?.id ?? portId;
}

function deviceLabel(
  inventory: InventoryDevice[],
  deviceId: string,
): { label: string; iconName: string } {
  if (deviceId === "laptop") {
    return { label: "Notebook de gerência", iconName: "laptop" };
  }
  const dev = inventory.find((d) => d.id === deviceId);
  return {
    label: dev?.label ?? deviceId,
    iconName: dev ? getDeviceIcon(dev.id, dev.type) : "help-circle-outline",
  };
}

function cableVisual(cableId: string) {
  return (
    DC_CABLE_VISUALS[cableId] ?? {
      color: DC_COLORS.accent,
      label: cableId,
      description: "",
    }
  );
}

/**
 * Produces the installation sequence: the order the user is expected to
 * rack the equipment, annotated with the slot (U) position that matches the
 * inventory's order in the JSON (top of rack = first inventory entry).
 */
function useInstallSequence(level: DataCenterLevel) {
  return useMemo(() => {
    const total = level.inventory.length;
    // We number slots from the BOTTOM (1U), which is the convention used in
    // the rack SVG tooltip. Index 0 of inventory corresponds to the TOP of
    // the rack (highest U number).
    return level.inventory.map((device, idx) => {
      const u = total - idx;
      return {
        device,
        slotIndex: idx,
        slotLabel: `${u}U`,
      };
    });
  }, [level.inventory]);
}

/**
 * Produces the cabling table grouped by the required connections of the
 * level, resolving labels and cable metadata for display.
 */
function useCablingTable(level: DataCenterLevel) {
  return useMemo(() => {
    return level.connections_required.map((req: RequiredConnection) => {
      const [fromDevId, fromPortId] = normalizeKey(req.from).split(".");
      const [toDevId, toPortId] = normalizeKey(req.to).split(".");
      const fromDev = level.inventory.find((d) => d.id === fromDevId);
      const toDev = level.inventory.find((d) => d.id === toDevId);
      return {
        fromDevId,
        fromDev,
        fromPortId,
        fromPortLabel: portLabel(fromDev, fromPortId),
        toDevId,
        toDev,
        toPortId,
        toPortLabel: portLabel(toDev, toPortId),
        cable: cableVisual(req.cable),
        note: req.note,
      };
    });
  }, [level.connections_required, level.inventory]);
}

export function RackInstallManual({ level, installedDevices }: Props) {
  const sequence = useInstallSequence(level);
  const cabling = useCablingTable(level);
  const installedCount = Object.keys(installedDevices).length;

  const [activePage, setActivePage] = useState(0);
  const totalPages = 3;

  const renderContent = () => {
    switch (activePage) {
      case 0:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Procedimento geral</Text>
            {[
              "Clique em um slot vazio (U) do rack para abrir a lista de equipamentos.",
              "Instale os equipamentos na ordem sugerida na próxima página.",
              "Com tudo racked, clique em uma porta de origem para iniciar um cabo.",
              "Escolha o tipo de cabo correto e clique na porta de destino.",
              "Use o cabo de console para abrir o terminal e configurar cada equipamento.",
              "Ao concluir todas as conexões, toque em Validar.",
            ].map((step, i) => (
              <View key={`step-${i}`} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        );
      case 1:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Sequência de instalação</Text>
            <Text style={styles.sectionHint}>
              Posicione os equipamentos nos slots (U) indicados abaixo.
            </Text>
            {sequence.map(({ device, slotIndex, slotLabel }, i) => {
              const installed = !!installedDevices[slotIndex];
              const iconName = getDeviceIcon(device.id, device.type);
              return (
                <View
                  key={`seq-${device.id}-${i}`}
                  style={[styles.deviceCard, installed && styles.deviceCardDone]}
                >
                  <View style={styles.deviceCardHeader}>
                    <View style={[styles.slotBadge, installed && styles.slotBadgeDone]}>
                      {installed ? (
                        <MaterialIcons name="check" size={14} color="#0b2b14" />
                      ) : (
                        <Text style={styles.slotBadgeText}>{slotLabel}</Text>
                      )}
                    </View>
                    <MaterialCommunityIcons
                      name={iconName as any}
                      size={18}
                      color={DC_COLORS.accentSoft}
                    />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.deviceName} numberOfLines={2}>
                        {device.label ?? device.id}
                      </Text>
                      <Text style={styles.deviceType} numberOfLines={1}>
                        {device.type} · {installed ? "Instalado" : `Slot ${slotLabel}`}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        );
      case 2:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Cabeamento ponto a ponto</Text>
            <Text style={styles.sectionHint}>
              Conecte as portas conforme especificado neste diagrama.
            </Text>
            {cabling.length === 0 ? (
              <Text style={styles.emptyText}>
                Este cenário não exige cabeamento adicional.
              </Text>
            ) : (
              cabling.map((row, i) => {
                const from = deviceLabel(level.inventory, row.fromDevId);
                const to = deviceLabel(level.inventory, row.toDevId);
                return (
                  <View key={`cab-${i}`} style={styles.cableCard}>
                    <View style={styles.cableHeader}>
                      <View
                        style={[
                          styles.cableBadge,
                          { backgroundColor: `${row.cable.color}22`, borderColor: row.cable.color },
                        ]}
                      >
                        <View
                          style={[styles.cableBadgeDot, { backgroundColor: row.cable.color }]}
                        />
                        <Text style={[styles.cableBadgeText, { color: row.cable.color }]}>
                          {row.cable.label}
                        </Text>
                      </View>
                      {row.note ? (
                        <View style={styles.noteRow}>
                          <MaterialIcons name="info-outline" size={12} color={DC_COLORS.info} />
                          <Text style={styles.noteText}>{row.note}</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.cableFlow}>
                      <View style={styles.endpointCol}>
                        <Text style={styles.endpointLabel}>De:</Text>
                        <View style={styles.endpointRow}>
                          <MaterialCommunityIcons name={from.iconName as any} size={14} color={DC_COLORS.textMuted} />
                          <Text style={styles.endpointDevice} numberOfLines={1}>{from.label}</Text>
                        </View>
                        <Text style={styles.endpointPort}>Porta <Text style={styles.endpointPortId}>{row.fromPortId}</Text></Text>
                      </View>

                      <MaterialIcons name="arrow-forward" size={16} color={DC_COLORS.textFaint} style={{ marginTop: 12 }} />

                      <View style={styles.endpointCol}>
                        <Text style={styles.endpointLabel}>Para:</Text>
                        <View style={styles.endpointRow}>
                          <MaterialCommunityIcons name={to.iconName as any} size={14} color={DC_COLORS.textMuted} />
                          <Text style={styles.endpointDevice} numberOfLines={1}>{to.label}</Text>
                        </View>
                        <Text style={styles.endpointPort}>Porta <Text style={styles.endpointPortId}>{row.toPortId}</Text></Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Step Indicator */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="book-open-variant" size={16} color={DC_COLORS.accentSoft} />
            <Text style={styles.title}>Manual de Instalação</Text>
          </View>
          <View style={styles.stepIndicator}>
            {[0, 1, 2].map((i) => (
              <View
                key={`dot-${i}`}
                style={[
                  styles.stepDot,
                  i === activePage && styles.stepDotActive,
                  i < activePage && styles.stepDotDone,
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressPillText}>
            {installedCount}/{level.inventory.length}
          </Text>
        </View>
      </View>

      {/* Paged Content */}
      <View style={styles.contentArea}>
        {renderContent()}
      </View>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <Pressable
          disabled={activePage === 0}
          onPress={() => setActivePage(p => p - 1)}
          style={({ pressed }) => [
            {
              opacity: (activePage === 0 || pressed) ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <View style={[styles.navButton, activePage === 0 && styles.navButtonDisabled]}>
            <MaterialIcons name="chevron-left" size={20} color={activePage === 0 ? DC_COLORS.textFaint : DC_COLORS.textPrimary} />
            <Text style={[styles.navButtonText, activePage === 0 && { color: DC_COLORS.textFaint }]}>Anterior</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => activePage < totalPages - 1 ? setActivePage(p => p + 1) : null}
          style={({ pressed }) => [
            {
              opacity: (activePage === totalPages - 1 || pressed) ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <View style={[styles.navButton, styles.navButtonPrimary, activePage === totalPages - 1 && styles.navButtonDisabled]}>
            <Text style={styles.navButtonTextPrimary}>
              {activePage === totalPages - 1 ? "Fim" : "Próximo"}
            </Text>
            <MaterialIcons name="chevron-right" size={20} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: DC_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  progressPill: {
    backgroundColor: `${DC_COLORS.accent}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DC_RADII.pill,
    borderWidth: 1,
    borderColor: `${DC_COLORS.accent}33`,
  },
  progressPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: DC_COLORS.accentSoft,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: DC_COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  sectionHint: {
    fontSize: 11,
    lineHeight: 15,
    color: DC_COLORS.textMuted,
    marginTop: -4,
  },
  contentArea: {
    minHeight: 240,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  stepDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: DC_COLORS.bgSurfaceHover,
  },
  stepDotActive: {
    backgroundColor: DC_COLORS.accent,
    width: 32,
  },
  stepDotDone: {
    backgroundColor: DC_COLORS.accentDeep,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DC_COLORS.borderSubtle,
    marginTop: 8,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: DC_RADII.md,
    gap: 4,
    backgroundColor: DC_COLORS.bgSurface,
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
  },
  navButtonPrimary: {
    backgroundColor: DC_COLORS.accent,
    borderColor: DC_COLORS.accent,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
  },
  navButtonTextPrimary: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cableFlow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 4,
  },
  endpointCol: {
    flex: 1,
    gap: 4,
  },
  endpointLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: DC_COLORS.textMuted,
    textTransform: "uppercase",
  },
  endpointRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  endpointDevice: {
    fontSize: 12,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
  },
  endpointPort: {
    fontSize: 11,
    color: DC_COLORS.textSecondary,
  },
  endpointPortId: {
    fontFamily: "Menlo",
    fontWeight: "700",
    color: DC_COLORS.accentSoft,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 6,
    backgroundColor: DC_COLORS.bgSurface,
    paddingHorizontal: 10,
    borderRadius: DC_RADII.md,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DC_COLORS.bgPanelRaised,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: DC_COLORS.accentSoft,
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: DC_COLORS.textSecondary,
  },

  deviceCard: {
    backgroundColor: DC_COLORS.bgSurface,
    borderRadius: DC_RADII.md,
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
    padding: 12,
  },
  deviceCardDone: {
    borderColor: DC_COLORS.success,
    backgroundColor: "rgba(34, 197, 94, 0.05)",
  },
  deviceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  slotBadge: {
    minWidth: 32,
    height: 20,
    borderRadius: 10,
    backgroundColor: DC_COLORS.bgPanelRaised,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
  },
  slotBadgeDone: {
    backgroundColor: DC_COLORS.success,
    borderColor: DC_COLORS.success,
  },
  slotBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: DC_COLORS.textPrimary,
  },
  deviceName: {
    fontSize: 13,
    fontWeight: "700",
    color: DC_COLORS.textPrimary,
  },
  deviceType: {
    fontSize: 11,
    color: DC_COLORS.textMuted,
    marginTop: 1,
  },

  cableCard: {
    backgroundColor: DC_COLORS.bgSurface,
    borderRadius: DC_RADII.md,
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
    padding: 12,
    gap: 10,
  },
  cableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: DC_COLORS.borderSubtle,
    paddingBottom: 8,
  },
  cableBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  cableBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cableBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    justifyContent: "flex-end",
  },
  noteText: {
    fontSize: 10,
    color: DC_COLORS.info,
    fontStyle: "italic",
  },
  emptyText: {
    fontSize: 12,
    color: DC_COLORS.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
});
