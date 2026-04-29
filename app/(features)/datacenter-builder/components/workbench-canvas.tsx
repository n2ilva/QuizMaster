import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { G } from "react-native-svg";

import {
    DC_BREAKPOINTS,
    DC_COLORS,
    DC_RADII,
    LAPTOP_GEOMETRY,
    RACK_GEOMETRY,
} from "../datacenter-builder.constants";
import { getCableColor } from "../datacenter-builder.helpers";
import type {
    ActiveConnection,
    Cable,
    DataCenterLevel,
    InventoryDevice,
    PortStatusMap
} from "../datacenter-builder.types";
import { CablePath, PendingSourceMarker } from "./cable-svg";
import { DeviceManual } from "./device-manual";
import { DeviceTerminal } from "./device-terminal";
import {
    LAPTOP_PORT,
    LaptopSvg,
    getLaptopScreenRect,
    getLaptopSerialPortLocalPos,
} from "./laptop-svg";
import { RackInstallManual } from "./rack-install-manual";
import {
    RACK_PORT,
    RackSvg,
    getPortX,
    getRackHeight,
    getSlotY,
} from "./rack-svg";

type WorkbenchCanvasProps = {
  /**
   * Full level reference — required so the install manual (shown in the
   * mobile "rack" view) can render the cabling table, rules and required
   * connections.
   */
  level: DataCenterLevel;
  inventory: InventoryDevice[];
  installedDevices: Record<number, InventoryDevice>;
  connections: ActiveConnection[];
  cableTypes: Cable[];
  ledOn: boolean;
  /** Per-port status map keyed by `${deviceId}.${portId}`. */
  portStatus: PortStatusMap;
  sourceNode: { deviceId: string; port: string } | null;
  consoleDevice: InventoryDevice | null;
  onSlotPress: (slotIndex: number) => void;
  onUninstall: (slotIndex: number) => void;
  onPortPress: (deviceId: string, port: string) => void;
  onLaptopSerialPress: () => void;
  onConsoleClose: () => void;
  /** Fired when the user completes a full CLI section on the active device. */
  onConsoleSectionCompleted?: (token: string, section: string) => void;
  /**
   * Fired when the terminal's TextInput gains/loses focus. The canvas
   * passes along the absolute Y position of the laptop within the canvas
   * so the parent screen can scroll it above the soft keyboard on mobile
   * and web mobile.
   */
  onConsoleInputFocusChange?: (focused: boolean, laptopAbsoluteY: number) => void;
  /** Tokens of CLI sections the user has already completed on the current device. */
  consoleManualCompletedTokens?: ReadonlySet<string>;
  /** Whether the device manual panel is collapsed. */
  consoleManualCollapsed?: boolean;
  /** Toggles the manual panel open/closed. */
  onConsoleManualToggle?: () => void;
  /**
   * Mobile-only view switcher. When the canvas layout is stacked (narrow
   * screens) we render either the rack OR the notebook at a time, so the
   * user isn't squinting at both on a small screen.
   *
   *  - "rack"      → show rack + install manual below.
   *  - "notebook"  → show laptop (with console cable to the connected
   *                   device) + device CLI manual below.
   *
   * Ignored when the canvas is wide enough to fit rack + laptop side by
   * side (desktop / tablet landscape).
   */
  mobileView?: "rack" | "notebook";
  /** Fired when the user toggles between rack and notebook in mobile view. */
  onMobileViewChange?: (next: "rack" | "notebook") => void;
};

/**
 * Renders the full workbench (rack + laptop + cables). Pure visual / input
 * glue — all state lives in the parent. The canvas positions a single
 * `Svg` layer and overlays transparent `Pressable`s at the exact positions
 * of ports and slots so clicks map 1:1 to SVG geometry.
 */
export function WorkbenchCanvas({
  level,
  inventory,
  installedDevices,
  connections,
  cableTypes,
  ledOn,
  portStatus,
  sourceNode,
  consoleDevice,
  onSlotPress,
  onUninstall,
  onPortPress,
  onLaptopSerialPress,
  onConsoleClose,
  onConsoleSectionCompleted,
  onConsoleInputFocusChange,
  consoleManualCompletedTokens,
  consoleManualCollapsed,
  onConsoleManualToggle,
  mobileView,
  onMobileViewChange,
}: WorkbenchCanvasProps) {
  const horizontalScrollRef = useRef<ScrollView>(null);

  // We measure the *container* width (not the window) so the canvas adapts
  // correctly when a sidebar or padding shrinks the available space.
  const [containerWidth, setContainerWidth] = useState(0);
  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - containerWidth) > 0.5) {
      setContainerWidth(w);
    }
  };
  // Until we have measured the container, fall back to a reasonable default
  // so the first render doesn't collapse to zero.
  const effectiveWidth = containerWidth > 0 ? containerWidth : 960;
  const stacked = effectiveWidth < DC_BREAKPOINTS.stackCanvas;
  // In stacked layout, we show either the rack OR the notebook — never both —
  // so the visualization stays legible on a phone. Desktop/tablet layouts
  // ignore `mobileView` entirely.
  const activeMobileView: "rack" | "notebook" =
    stacked ? mobileView ?? "rack" : "rack";
  const showRack = !stacked || activeMobileView === "rack";
  const showLaptop = !stacked || activeMobileView === "notebook";

  // Height reserved above the laptop for the device manual panel. It floats
  // just on top of the notebook so the user can see the required CLI
  // sections while typing. When there is no active console session the
  // reservation collapses to zero.
  //
  // The open height is responsive: on narrow screens we keep a smaller fixed
  // panel and rely on the manual's internal ScrollView so it never overlaps
  // the notebook.
  const MANUAL_GAP = 10;
  // Collapsed shows the full header (icon + title + 2-line subtitle + pill)
  // without truncating the description.
  const MANUAL_COLLAPSED_H = 80;
  const MANUAL_OPEN_H =
    effectiveWidth < 480 ? 320 : effectiveWidth < 720 ? 360 : 400;
  const manualHeight = consoleDevice
    ? consoleManualCollapsed
      ? MANUAL_COLLAPSED_H
      : MANUAL_OPEN_H
    : 0;
  // The floating manual panel only exists in non-stacked (desktop) layouts.
  // In stacked/mobile mode the manual is rendered below the canvas as a
  // regular block that can scroll naturally with the rest of the workbench.
  const floatingManualActive = !stacked && !!consoleDevice;
  const manualReserved = floatingManualActive ? manualHeight + MANUAL_GAP : 0;

  // Layout math --------------------------------------------------------------
  const layout = useMemo(() => {
    const slots = inventory.length || 1;
    const rackW = RACK_GEOMETRY.width;
    const rackH = getRackHeight(slots);
    const lapW = LAPTOP_GEOMETRY.width;
    const lapH = LAPTOP_GEOMETRY.height + LAPTOP_GEOMETRY.baseExtra;

    // The canvas tries to fit the wider of the two shapes at each column.
    // On stacked mode we size by the *wider* shape, otherwise side by side.
    const horizontalPadding = 32;
    const availableWidth = Math.max(320, effectiveWidth - horizontalPadding);

    if (stacked) {
      // Only one shape is visible at a time in stacked mode: either the rack
      // (with the install manual below it) or the laptop (with the device
      // CLI manual below it). We size the canvas to just the active shape.
      if (activeMobileView === "notebook") {
        // On mobile the serial/console port juts out to the right of the
        // laptop base (see getLaptopSerialPortLocalPos). Reserve a small
        // gutter so the port + cable attachment aren't clipped, but keep
        // it minimal so the notebook fills the screen as much as possible.
        const rightGutter = 40;
        const effectiveLapW = lapW + rightGutter;
        const scale = Math.min(1, availableWidth / effectiveLapW);
        // Align laptop to the left edge (no centering with gutter) so
        // the screen content is as large as possible.
        const laptopOffsetX = 0;
        // Push the laptop down to leave room for the floating manual panel.
        const laptopOffsetY = manualReserved;
        const totalW = availableWidth;
        const totalH = laptopOffsetY + lapH * scale + 20;
        // Rack is off-screen and unused in this view; positions kept stable
        // to keep the math of `getAbsolutePortPos` well-defined even though
        // nothing using them is rendered.
        return {
          stacked: true,
          scale,
          rackOffsetX: 0,
          rackOffsetY: 0,
          laptopOffsetX,
          laptopOffsetY,
          totalW,
          totalH,
        };
      }
      // Rack-only view.
      const scale = Math.min(1, availableWidth / rackW);
      const rackOffsetX = (availableWidth - rackW * scale) / 2;
      const rackOffsetY = 0;
      const totalW = availableWidth;
      const totalH = rackOffsetY + rackH * scale + 20;
      return {
        stacked: true,
        scale,
        rackOffsetX,
        rackOffsetY,
        laptopOffsetX: 0,
        laptopOffsetY: 0,
        totalW,
        totalH,
      };
    }

    const gap = 80;
    const needed = rackW + gap + lapW;
    const scale = Math.min(1, availableWidth / needed);
    const rackOffsetX = 20;
    const laptopOffsetX = rackOffsetX + rackW * scale + gap * scale;
    const rackOffsetY = 20;
    // In desktop mode the laptop sits next to the rack; push it down to leave
    // room for the manual panel hovering above it.
    const laptopOffsetY = 20 + manualReserved;
    const totalW = laptopOffsetX + lapW * scale + 20;
    const totalH = Math.max(rackH + 40, laptopOffsetY + lapH * scale + 20);
    return {
      stacked: false,
      scale,
      rackOffsetX,
      rackOffsetY,
      laptopOffsetX,
      laptopOffsetY,
      totalW,
      totalH,
    };
  }, [effectiveWidth, stacked, activeMobileView, inventory.length, manualReserved]);

  // Auto-scroll to laptop when console is connected in desktop mode
  useEffect(() => {
    if (consoleDevice && !stacked && horizontalScrollRef.current) {
      // Small timeout to ensure layout has settled
      const timer = setTimeout(() => {
        horizontalScrollRef.current?.scrollTo({
          x: layout.laptopOffsetX - 40,
          animated: true,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [consoleDevice, stacked, layout.laptopOffsetX]);

  const boardWidth = RACK_GEOMETRY.width - RACK_GEOMETRY.railWidth * 2;

  // Absolute port position in outer SVG space (already scaled). -------------
  const getAbsolutePortPos = (deviceId: string, portId: string) => {
    const slotIndex = Object.keys(installedDevices).find(
      (k) => installedDevices[parseInt(k, 10)].id === deviceId,
    );
    if (slotIndex === undefined) return null;
    const idx = parseInt(slotIndex, 10);
    const dev = installedDevices[idx];
    const portIndex = dev.ports.findIndex((p) => p.id === portId);
    if (portIndex < 0) return null;
    const port = dev.ports[portIndex];

    const localX =
      RACK_GEOMETRY.railWidth +
      getPortX(port, portIndex, boardWidth) +
      RACK_PORT.width / 2;
    const localY = getSlotY(idx) + RACK_PORT.topOffset + RACK_PORT.height / 2;

    return {
      x: layout.rackOffsetX + localX * layout.scale,
      y: layout.rackOffsetY + localY * layout.scale,
    };
  };

  const laptopSerialAbsPos = (() => {
    const local = getLaptopSerialPortLocalPos(layout.stacked);
    return {
      x:
        layout.laptopOffsetX +
        (local.x + LAPTOP_PORT.width / 2) * layout.scale,
      y:
        layout.laptopOffsetY +
        (local.y + LAPTOP_PORT.height / 2) * layout.scale,
    };
  })();

  const getAbsolutePortFor = (endpoint: {
    deviceId: string;
    port: string;
  }) => {
    if (endpoint.deviceId === "laptop") return laptopSerialAbsPos;
    return getAbsolutePortPos(endpoint.deviceId, endpoint.port);
  };

  const sourceAbs = sourceNode ? getAbsolutePortFor(sourceNode) : null;

  // Screen rect for the laptop terminal overlay ----------------------------
  const screenRect = (() => {
    const r = getLaptopScreenRect();
    return {
      left: layout.laptopOffsetX + r.x * layout.scale,
      top: layout.laptopOffsetY + r.y * layout.scale,
      width: r.width * layout.scale,
      height: r.height * layout.scale,
    };
  })();

  const content = (
    <View
      style={{ width: layout.totalW, height: layout.totalH }}
      accessibilityRole="none"
    >
      <Svg width={layout.totalW} height={layout.totalH}>
        {/* Rack */}
        {showRack ? (
          <G
            transform={`translate(${layout.rackOffsetX}, ${layout.rackOffsetY}) scale(${layout.scale})`}
          >
            <RackSvg
              inventory={inventory}
              installedDevices={installedDevices}
              ledOn={ledOn}
              portStatus={portStatus}
              selectedPort={sourceNode}
            />
          </G>
        ) : null}

        {/* Laptop */}
        {showLaptop ? (
          <G
            transform={`translate(${layout.laptopOffsetX}, ${layout.laptopOffsetY}) scale(${layout.scale})`}
          >
            <LaptopSvg
              connected={!!consoleDevice}
              serialSelected={sourceNode?.deviceId === "laptop"}
              serialOnRight={layout.stacked}
            />
          </G>
        ) : null}

        {/* Cables (in outer coordinate space).
            Console cables (laptop endpoint) are drawn in a separate SVG overlay
            rendered AFTER the terminal screen view, so they pass in front of the
            laptop's terminal display — matching how a real console cable sits
            visually in front of the laptop.
            In mobile single-shape mode we hide inter-rack cables while on the
            notebook view (rack isn't drawn), since both endpoints would be
            off-screen. */}
        {showRack &&
          connections.map((conn) => {
            if (!conn.to) return null;
            const isConsoleCable =
              conn.from.deviceId === "laptop" || conn.to.deviceId === "laptop";
            if (isConsoleCable) return null;
            const from = getAbsolutePortFor(conn.from);
            const to = getAbsolutePortFor(conn.to);
            if (!from || !to) return null;
            const color = getCableColor(conn.cableId, cableTypes);
            return (
              <CablePath
                key={conn.id}
                from={from}
                to={to}
                color={color}
                dashed={conn.cableId === "console"}
                strokeWidth={3.2 * layout.scale + 0.4}
              />
            );
          })}

        {/* Pending source marker (only when source is not the laptop serial —
            laptop-origin pending marker is rendered in the overlay SVG below).
            Only meaningful when the rack is on-screen. */}
        {showRack && sourceAbs && sourceNode?.deviceId !== "laptop" && (
          <PendingSourceMarker
            from={sourceAbs}
            strokeWidth={3.2 * layout.scale + 0.4}
          />
        )}
      </Svg>

      {/* Interaction overlays ------------------------------------------- */}
      {/* Slot / port presseables (only when the rack is visible) */}
      {showRack ? (
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: layout.rackOffsetX,
          top: layout.rackOffsetY,
          width: RACK_GEOMETRY.width * layout.scale,
          height: getRackHeight(inventory.length) * layout.scale,
        }}
      >
        {inventory.map((_, i) => {
          const installed = installedDevices[i];
          const slotTop = getSlotY(i) * layout.scale;
          const slotH = RACK_GEOMETRY.slotHeight * layout.scale;
          const rail = RACK_GEOMETRY.railWidth;
          // Uninstall button sits on the right rail between the two screws
          // (screws are at y+14 and y+slotHeight-14, centered at rackWidth-rail/2).
          const removeSize = Math.max(22, 18 * layout.scale);
          const removeX =
            (RACK_GEOMETRY.width - rail / 2) * layout.scale - removeSize / 2;
          const removeY =
            (RACK_GEOMETRY.slotHeight / 2) * layout.scale - removeSize / 2;
          return (
            <View
              key={`slot-overlay-${i}`}
              pointerEvents="box-none"
              style={{
                position: "absolute",
                left: 0,
                top: slotTop,
                width: RACK_GEOMETRY.width * layout.scale,
                height: slotH,
              }}
            >
              {/* Background press area:
                  - empty slot → opens install picker.
                  - occupied slot → no-op (kept transparent so clicks on the
                    ports aren't swallowed by a remove-on-tap behavior). */}
              {installed ? null : (
                <Pressable
                  onPress={() => onSlotPress(i)}
                  style={StyleSheet.absoluteFillObject}
                  accessibilityRole="button"
                  accessibilityLabel={`Instalar equipamento no slot ${inventory.length - i}U`}
                />
              )}
              {installed &&
                installed.ports.map((p, pIdx) => {
                  const px =
                    (RACK_GEOMETRY.railWidth +
                      getPortX(p, pIdx, boardWidth)) *
                    layout.scale;
                  const py = RACK_PORT.topOffset * layout.scale;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => onPortPress(installed.id, p.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Porta ${p.id} de ${installed.label ?? installed.id}`}
                      hitSlop={6}
                      style={{
                        position: "absolute",
                        left: px,
                        top: py,
                        width: Math.max(28, RACK_PORT.width * layout.scale),
                        height: Math.max(28, RACK_PORT.height * layout.scale),
                      }}
                    />
                  );
                })}
              {installed ? (
                <View
                  style={{
                    position: "absolute",
                    left: removeX,
                    top: removeY,
                    width: removeSize,
                    height: removeSize,
                    zIndex: 10,
                  }}
                >
                  <Pressable
                    onPress={() => onUninstall(i)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${installed.label ?? installed.id}`}
                    hitSlop={6}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.7 : 1,
                        transform: [{ scale: pressed ? 0.92 : 1 }],
                      },
                    ]}
                  >
                    <View style={[styles.removeBtn, { width: removeSize, height: removeSize, borderRadius: removeSize / 2 }]}>
                      <MaterialIcons
                        name="close"
                        size={Math.max(12, removeSize * 0.6)}
                        color="#FFFFFF"
                      />
                    </View>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
      ) : null}

      {/* Laptop serial port overlay (only when the laptop is visible) */}
      {showLaptop ? (
        <Pressable
          onPress={onLaptopSerialPress}
          accessibilityRole="button"
          accessibilityLabel="Porta serial do notebook"
          hitSlop={8}
          style={{
            position: "absolute",
            left: laptopSerialAbsPos.x - Math.max(18, LAPTOP_PORT.width * layout.scale) / 2,
            top: laptopSerialAbsPos.y - Math.max(18, LAPTOP_PORT.height * layout.scale) / 2,
            width: Math.max(36, LAPTOP_PORT.width * layout.scale + 12),
            height: Math.max(36, LAPTOP_PORT.height * layout.scale + 12),
          }}
        />
      ) : null}

      {/* Device manual — floats just above the notebook so the user can read
          the expected CLI sections while typing. Its width matches the
          laptop body (scaled).
          In mobile stacked mode we move this manual BELOW the canvas (see the
          outer render below) so it can scroll freely, so we skip the floating
          variant here. */}
      {showLaptop && consoleDevice && !layout.stacked ? (
        <View
          style={{
            position: "absolute",
            left: layout.laptopOffsetX,
            top: Math.max(4, layout.laptopOffsetY - manualHeight - MANUAL_GAP),
            width: LAPTOP_GEOMETRY.width * layout.scale,
            height: manualHeight,
          }}
        >
          <DeviceManual
            device={consoleDevice}
            completedTokens={consoleManualCompletedTokens ?? new Set()}
            collapsed={!!consoleManualCollapsed}
            onToggleCollapsed={() => onConsoleManualToggle?.()}
          />
        </View>
      ) : null}

      {/* Terminal content over the laptop screen (only when laptop visible) */}
      {showLaptop ? (
      <View
        pointerEvents={consoleDevice ? "auto" : "none"}
        style={{
          position: "absolute",
          left: screenRect.left,
          top: screenRect.top,
          width: screenRect.width,
          height: screenRect.height,
          padding: 8,
        }}
      >
        {consoleDevice ? (
          <DeviceTerminal
            device={consoleDevice}
            onClose={onConsoleClose}
            onSectionCompleted={onConsoleSectionCompleted}
            onInputFocusChange={(focused) =>
              onConsoleInputFocusChange?.(focused, layout.laptopOffsetY)
            }
          />
        ) : (
          <View style={styles.screenIdle}>
            <MaterialCommunityIcons name="console-network" size={36} color={DC_COLORS.textFaint} />
            <Text style={styles.screenIdleText}>AGUARDANDO CONEXÃO</Text>
            <Text style={styles.screenIdleHint}>
              Conecte o cabo de console do notebook a um equipamento.
            </Text>
          </View>
        )}
      </View>
      ) : null}

      {/* Console cable overlay — drawn ABOVE the terminal screen so the cable
          visually passes in front of the laptop display (like a real console
          cable plugged into the side of a notebook). In mobile "rack" view
          neither endpoint is on-screen, so we skip it entirely. */}
      {showLaptop ? (
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: layout.totalW,
          height: layout.totalH,
        }}
      >
        <Svg width={layout.totalW} height={layout.totalH}>
          {connections.map((conn) => {
            if (!conn.to) return null;
            const isConsoleCable =
              conn.from.deviceId === "laptop" || conn.to.deviceId === "laptop";
            if (!isConsoleCable) return null;
            const rawFrom = getAbsolutePortFor(conn.from);
            const rawTo = getAbsolutePortFor(conn.to);
            if (!rawFrom || !rawTo) return null;

            // The cable must enter the laptop serial port from the RIGHT
            // side in the mobile/stacked "notebook" view — otherwise the
            // bezier from an off-screen rack port above cuts straight
            // across the laptop screen. We synthesize a virtual origin
            // just above/right of the serial port so the curve enters
            // horizontally from the right.
            const laptopEndpointIsFrom = conn.from.deviceId === "laptop";
            const laptopPos = laptopEndpointIsFrom ? rawFrom : rawTo;
            const otherPos = laptopEndpointIsFrom ? rawTo : rawFrom;
            const useSideEntry = layout.stacked && activeMobileView === "notebook";
            let from = rawFrom;
            let to = rawTo;
            let routing: "default" | "side-right" = "default";
            if (useSideEntry) {
              // Virtual "coming from above the right edge" point — sits
              // off the right side of the laptop so the cable drops down
              // alongside it and curves in from the right.
              const virtualOrigin = {
                x: laptopPos.x + 70,
                y: Math.max(0, laptopPos.y - 140),
              };
              // Always route: virtual origin (top-right) → laptop serial port.
              from = virtualOrigin;
              to = laptopPos;
              routing = "side-right";
              // `otherPos` is off-screen (rack hidden) so we ignore it.
              void otherPos;
            }
            const color = getCableColor(conn.cableId, cableTypes);
            return (
              <CablePath
                key={conn.id}
                from={from}
                to={to}
                color={color}
                dashed={conn.cableId === "console"}
                strokeWidth={3.2 * layout.scale + 0.4}
                routing={routing}
              />
            );
          })}
          {sourceAbs && sourceNode?.deviceId === "laptop" && (
            <PendingSourceMarker
              from={sourceAbs}
              strokeWidth={3.2 * layout.scale + 0.4}
            />
          )}
        </Svg>
      </View>
      ) : null}
    </View>
  );

  // Horizontal scroll only when we actually overflow -----------------------
  // In stacked/mobile mode we also render a view toggle at the top (rack vs
  // notebook) and the companion manual below the canvas (install manual when
  // the rack is visible, CLI manual when the laptop is visible).
  return (
    <View onLayout={handleLayout} style={{ width: "100%", overflow: "hidden" }}>
      {layout.stacked ? (
        <MobileViewToggle
          activeView={activeMobileView}
          consoleConnected={!!consoleDevice}
          onChange={(next) => onMobileViewChange?.(next)}
        />
      ) : null}

      <ScrollView
        ref={horizontalScrollRef}
        horizontal={!layout.stacked}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "flex-start", paddingHorizontal: 0 }}
      >
        {content}
      </ScrollView>

      {layout.stacked && activeMobileView === "rack" ? (
        <View style={{ paddingHorizontal: 0, paddingTop: 12 }}>
          <RackInstallManual level={level} installedDevices={installedDevices} />
        </View>
      ) : null}

      {layout.stacked && activeMobileView === "notebook" && consoleDevice ? (
        <View style={{ paddingHorizontal: 0, paddingTop: 12 }}>
          <DeviceManual
            device={consoleDevice}
            completedTokens={consoleManualCompletedTokens ?? new Set()}
            collapsed={!!consoleManualCollapsed}
            onToggleCollapsed={() => onConsoleManualToggle?.()}
          />
        </View>
      ) : null}

      {layout.stacked && activeMobileView === "notebook" && !consoleDevice ? (
        <View style={{ paddingHorizontal: 0, paddingTop: 12 }}>
          <View style={styles.noConsoleHint}>
            <MaterialCommunityIcons
              name="console-network"
              size={22}
              color={DC_COLORS.textFaint}
            />
            <Text style={styles.noConsoleTitle}>Nenhum equipamento conectado</Text>
            <Text style={styles.noConsoleText}>
              Volte para a visualização do rack e conecte o cabo de console do
              notebook a um equipamento para iniciar o terminal.
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

/**
 * Small segmented control shown at the top of the workbench in mobile mode
 * so the user can flip between the rack view and the notebook view. The
 * notebook tab is disabled until a console cable has been connected, so it
 * doesn't offer a view that would be empty otherwise.
 */
function MobileViewToggle({
  activeView,
  consoleConnected,
  onChange,
}: {
  activeView: "rack" | "notebook";
  consoleConnected: boolean;
  onChange: (next: "rack" | "notebook") => void;
}) {
  const tabs: { id: "rack" | "notebook"; label: string; icon: string; disabled?: boolean }[] = [
    { id: "rack", label: "Rack", icon: "server" },
    {
      id: "notebook",
      label: "Notebook",
      icon: "laptop",
      disabled: !consoleConnected,
    },
  ];
  return (
    <View style={styles.toggleWrap}>
      {tabs.map((t) => {
        const active = t.id === activeView;
        return (
          <View key={t.id} style={styles.toggleTabWrapper}>
            <Pressable
              disabled={t.disabled}
              onPress={() => onChange(t.id)}
              style={({ pressed }) => [
                {
                  opacity: (t.disabled || pressed) ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active, disabled: t.disabled }}
              accessibilityLabel={`Visualização ${t.label}`}
            >
              <View
                style={[
                  styles.toggleTab,
                  active && styles.toggleTabActive,
                  t.disabled && styles.toggleTabDisabled,
                ]}
              >
                <MaterialCommunityIcons
                  name={t.icon as any}
                  size={16}
                  color={active ? DC_COLORS.textPrimary : DC_COLORS.textMuted}
                />
                <Text
                  style={[
                    styles.toggleTabLabel,
                    active && styles.toggleTabLabelActive,
                  ]}
                >
                  {t.label}
                </Text>
                {t.id === "notebook" && !consoleConnected ? (
                  <MaterialIcons name="lock-outline" size={13} color={DC_COLORS.textFaint} />
                ) : null}
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  removeBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DC_COLORS.danger,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  removeBtnHover: {
    backgroundColor: DC_COLORS.danger,
  },
  removeBtnPressed: {
    backgroundColor: "rgba(185,28,28,0.95)",
    transform: [{ scale: 0.92 }],
  },
  toggleWrap: {
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: DC_COLORS.bgPanelInset,
    borderRadius: DC_RADII.pill,
    borderWidth: 1,
    borderColor: DC_COLORS.borderSubtle,
    padding: 4,
    marginBottom: 16,
    marginHorizontal: 0,
    overflow: "hidden",
  },
  toggleTabWrapper: {
    flex: 1,
    borderRadius: DC_RADII.pill,
    overflow: "hidden",
  },
  toggleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: DC_RADII.pill,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
  },
  toggleTabActive: {
    backgroundColor: DC_COLORS.bgSurface,
    borderColor: DC_COLORS.borderStrong,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleTabHover: {
    backgroundColor: DC_COLORS.bgSurface,
  },
  toggleTabDisabled: {
    opacity: 0.5,
  },
  toggleTabLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: DC_COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginLeft: 8,
  },
  toggleTabLabelActive: {
    color: DC_COLORS.textPrimary,
  },
  noConsoleHint: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 18,
    backgroundColor: DC_COLORS.bgPanel,
    borderRadius: DC_RADII.lg,
    borderWidth: 1,
    borderColor: DC_COLORS.borderMuted,
  },
  noConsoleTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: DC_COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  noConsoleText: {
    fontSize: 12,
    lineHeight: 16,
    color: DC_COLORS.textSecondary,
    textAlign: "center",
  },
  terminal: {
    flex: 1,
    backgroundColor: DC_COLORS.terminalBg,
    borderRadius: DC_RADII.sm,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.15)",
    overflow: "hidden",
  },
  terminalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  terminalDots: {
    flexDirection: "row",
    gap: 4,
  },
  terminalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  terminalTitle: {
    flex: 1,
    color: DC_COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  terminalClose: {
    color: DC_COLORS.textMuted,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  terminalBody: {
    flex: 1,
    padding: 10,
    gap: 2,
  },
  terminalLine: {
    color: DC_COLORS.terminalText,
    fontSize: 10,
    fontFamily: "monospace",
  },
  screenIdle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  screenIdleText: {
    color: DC_COLORS.textFaint,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  screenIdleHint: {
    color: DC_COLORS.textFaint,
    fontSize: 10,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 14,
  },
});
