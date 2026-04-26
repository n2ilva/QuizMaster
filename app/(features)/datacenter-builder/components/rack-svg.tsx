import React from "react";
import {
    Circle,
    Defs,
    G,
    LinearGradient,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from "react-native-svg";

import { DC_COLORS, RACK_GEOMETRY } from "../datacenter-builder.constants";
import type { InventoryDevice, PortStatus, PortStatusMap } from "../datacenter-builder.types";

type RackSvgProps = {
  inventory: InventoryDevice[];
  installedDevices: Record<number, InventoryDevice>;
  /** Global blink tick — toggles every ~600ms. */
  ledOn: boolean;
  /** Per-port status map keyed by `${deviceId}.${portId}`. */
  portStatus?: PortStatusMap;
  selectedPort?: { deviceId: string; port: string } | null;
};

/**
 * Link-LED colors used by each port. Progression is BLUE → ORANGE → GREEN:
 *   - idle     → blue,   blinking (powered, awaiting cable)
 *   - wrong    → orange, blinking (cable plugged but wrong type)
 *   - unneeded → orange, blinking (connection not required)
 *   - ok       → green,  solid   (correct cable, link up)
 */
const LED_ON_COLORS: Record<PortStatus, string> = {
  idle: "#3B82F6", // blue-500
  ok: "#22C55E", // green-500
  wrong: "#F59E0B", // amber-500
  unneeded: "#F59E0B",
};
const LED_OFF_COLORS: Record<PortStatus, string> = {
  idle: "#12243F", // dim blue
  ok: "#22C55E", // stays solid
  wrong: "#3F2A07", // dim amber
  unneeded: "#3F2A07",
};

export function getPortLedColor(status: PortStatus, blinkOn: boolean): string {
  return blinkOn ? LED_ON_COLORS[status] : LED_OFF_COLORS[status];
}

const SCREW_INSET_X = 10;
const SCREW_INSET_Y = 12;

/**
 * Port geometry helpers — exported so the outer component can align overlay
 * Pressables with the rendered SVG without duplicating constants.
 */
export const RACK_PORT = {
  width: 26,
  height: 22,
  gap: 6,
  topOffset: 44,
  startOffset: 58,
  consoleFromRight: 70,
};

/** Returns the SVG X of a port inside a slot (device coordinate space). */
export function getPortX(port: { id: string }, portIndex: number, boardWidth: number): number {
  if (port.id === "console") return boardWidth - RACK_PORT.consoleFromRight;
  return RACK_PORT.startOffset + portIndex * (RACK_PORT.width + RACK_PORT.gap);
}

/** Returns the SVG Y of a slot's top. */
export function getSlotY(slotIndex: number): number {
  return RACK_GEOMETRY.paddingTop + slotIndex * RACK_GEOMETRY.slotHeight;
}

/** Returns the total rack height for the given slot count. */
export function getRackHeight(slotCount: number): number {
  return (
    RACK_GEOMETRY.paddingTop +
    slotCount * RACK_GEOMETRY.slotHeight +
    RACK_GEOMETRY.paddingBottom
  );
}

/**
 * Renders the full rack chassis with all slots. Visual only — interactions
 * are handled by transparent overlays in the parent component.
 */
export function RackSvg({
  inventory,
  installedDevices,
  ledOn,
  portStatus,
  selectedPort,
}: RackSvgProps) {
  const slots = inventory.length;
  const rackWidth = RACK_GEOMETRY.width;
  const rackHeight = getRackHeight(slots);
  const rail = RACK_GEOMETRY.railWidth;
  const boardWidth = rackWidth - rail * 2;

  return (
    <G>
      <Defs>
        <LinearGradient id="rack-body" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={DC_COLORS.rackMetal} />
          <Stop offset="1" stopColor={DC_COLORS.rackMetalDark} />
        </LinearGradient>
        <LinearGradient id="rack-rail" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={DC_COLORS.rackRail} />
          <Stop offset="0.5" stopColor={DC_COLORS.rackRailHighlight} />
          <Stop offset="1" stopColor={DC_COLORS.rackRail} />
        </LinearGradient>
        <LinearGradient id="rack-inset" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#05070A" />
          <Stop offset="1" stopColor="#0A0D12" />
        </LinearGradient>
        <LinearGradient id="device-face" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={DC_COLORS.deviceTop} />
          <Stop offset="1" stopColor={DC_COLORS.deviceFace} />
        </LinearGradient>
        <LinearGradient id="device-face-dark" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={DC_COLORS.deviceFace} />
          <Stop offset="1" stopColor={DC_COLORS.deviceFaceDark} />
        </LinearGradient>
        <LinearGradient id="port-body" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#16181D" />
          <Stop offset="1" stopColor={DC_COLORS.portBody} />
        </LinearGradient>
      </Defs>

      {/* Chassis */}
      <Rect
        x={0}
        y={0}
        width={rackWidth}
        height={rackHeight}
        rx={14}
        fill="url(#rack-body)"
        stroke={DC_COLORS.borderStrong}
        strokeWidth={1.5}
      />

      {/* Inner shadow plate */}
      <Rect
        x={rail - 2}
        y={RACK_GEOMETRY.paddingTop - 4}
        width={boardWidth + 4}
        height={rackHeight - RACK_GEOMETRY.paddingTop - RACK_GEOMETRY.paddingBottom + 8}
        rx={6}
        fill="url(#rack-inset)"
      />

      {/* Vertical rails */}
      <Rect x={0} y={0} width={rail} height={rackHeight} fill="url(#rack-rail)" />
      <Rect x={rackWidth - rail} y={0} width={rail} height={rackHeight} fill="url(#rack-rail)" />

      {/* Corner screws */}
      {[
        [SCREW_INSET_X, SCREW_INSET_Y],
        [rackWidth - SCREW_INSET_X, SCREW_INSET_Y],
        [SCREW_INSET_X, rackHeight - SCREW_INSET_Y],
        [rackWidth - SCREW_INSET_X, rackHeight - SCREW_INSET_Y],
      ].map(([cx, cy], i) => (
        <G key={`screw-${i}`}>
          <Circle cx={cx} cy={cy} r={3.5} fill={DC_COLORS.rackScrew} />
          <Path
            d={`M ${cx - 2} ${cy} L ${cx + 2} ${cy}`}
            stroke={DC_COLORS.rackMetalDark}
            strokeWidth={0.8}
          />
        </G>
      ))}

      {/* Slot markers and U numbering */}
      {inventory.map((_, i) => {
        const y = getSlotY(i);
        const midY = y + RACK_GEOMETRY.slotHeight / 2;
        return (
          <G key={`rail-${i}`}>
            <Circle cx={rail / 2} cy={y + 14} r={1.6} fill={DC_COLORS.rackScrew} />
            <Circle
              cx={rail / 2}
              cy={y + RACK_GEOMETRY.slotHeight - 14}
              r={1.6}
              fill={DC_COLORS.rackScrew}
            />
            <Circle cx={rackWidth - rail / 2} cy={y + 14} r={1.6} fill={DC_COLORS.rackScrew} />
            <Circle
              cx={rackWidth - rail / 2}
              cy={y + RACK_GEOMETRY.slotHeight - 14}
              r={1.6}
              fill={DC_COLORS.rackScrew}
            />
            <SvgText
              x={rail / 2}
              y={midY + 3}
              fill={DC_COLORS.textFaint}
              fontSize={8}
              fontWeight="700"
              textAnchor="middle"
            >
              {slots - i}U
            </SvgText>
          </G>
        );
      })}

      {/* Slots */}
      {inventory.map((expected, i) => {
        const installed = installedDevices[i];
        const y = getSlotY(i);
        return (
          <G key={`slot-${i}`}>
            {installed ? (
              <InstalledDevice
                slotIndex={i}
                y={y}
                device={installed}
                boardWidth={boardWidth}
                railWidth={rail}
                ledOn={ledOn}
                portStatus={portStatus}
                selectedPort={selectedPort ?? null}
              />
            ) : (
              <EmptySlot
                y={y}
                expectedLabel={expected.label ?? expected.id}
                boardWidth={boardWidth}
                railWidth={rail}
              />
            )}
          </G>
        );
      })}
    </G>
  );
}

type EmptySlotProps = {
  y: number;
  expectedLabel: string;
  boardWidth: number;
  railWidth: number;
};

function EmptySlot({ y, expectedLabel, boardWidth, railWidth }: EmptySlotProps) {
  const SLOT_H = RACK_GEOMETRY.slotHeight;
  return (
    <G>
      <Rect
        x={railWidth + 4}
        y={y + 4}
        width={boardWidth - 8}
        height={SLOT_H - 8}
        rx={6}
        fill="#06080B"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={1}
        strokeDasharray="4,4"
      />
      <SvgText
        x={railWidth + boardWidth / 2}
        y={y + SLOT_H / 2 + 4}
        fill={DC_COLORS.textFaint}
        fontSize={10}
        fontWeight="700"
        textAnchor="middle"
      >
        VAZIO
      </SvgText>
    </G>
  );
}

type InstalledDeviceProps = {
  slotIndex: number;
  y: number;
  device: InventoryDevice;
  boardWidth: number;
  railWidth: number;
  ledOn: boolean;
  portStatus?: PortStatusMap;
  selectedPort: { deviceId: string; port: string } | null;
};

function InstalledDevice({
  y,
  device,
  boardWidth,
  railWidth,
  ledOn,
  portStatus,
  selectedPort,
}: InstalledDeviceProps) {
  const SLOT_H = RACK_GEOMETRY.slotHeight;
  const faceX = railWidth;
  const faceWidth = boardWidth;

  // Aggregate the states of this device's ports to drive the 3 front-panel
  // LEDs. Progression is BLUE → ORANGE → GREEN:
  //   - POWER  (blue, solid)       device is powered on and awaiting a cable.
  //   - ACTIVITY (orange, blinks)  at least one port has a wrong/unneeded cable.
  //   - LINK   (green, solid)      at least one port is correctly wired.
  let hasWrong = false;
  let hasOk = false;
  if (portStatus) {
    device.ports.forEach((p) => {
      const s = portStatus[`${device.id}.${p.id}`];
      if (s === "wrong" || s === "unneeded") hasWrong = true;
      if (s === "ok") hasOk = true;
    });
  }
  const powerLed = "#3B82F6"; // always on — device is powered (blue)
  const activityLed = hasWrong ? (ledOn ? "#F59E0B" : "#3F2A07") : "#3F2A07";
  const linkLed = hasOk ? "#22C55E" : "#14532D"; // green solid when linked

  return (
    <G>
      {/* 1U front panel — top edge */}
      <Rect
        x={faceX}
        y={y}
        width={faceWidth}
        height={SLOT_H}
        rx={3}
        fill="url(#device-face-dark)"
      />
      {/* Brushed face */}
      <Rect
        x={faceX + 3}
        y={y + 3}
        width={faceWidth - 6}
        height={SLOT_H - 6}
        rx={2}
        fill="url(#device-face)"
      />
      {/* Ventilation slits */}
      {Array.from({ length: 18 }).map((_, i) => (
        <Rect
          key={`vent-${i}`}
          x={faceX + 8 + i * 6}
          y={y + SLOT_H - 9}
          width={3}
          height={4}
          rx={1}
          fill="rgba(0,0,0,0.28)"
        />
      ))}

      {/* Mounting ears (faux holes) */}
      <Circle cx={faceX + 10} cy={y + SLOT_H / 2} r={2.2} fill="rgba(0,0,0,0.35)" />
      <Circle
        cx={faceX + faceWidth - 10}
        cy={y + SLOT_H / 2}
        r={2.2}
        fill="rgba(0,0,0,0.35)"
      />

      {/* Front-panel LEDs — order: POWER (solid blue, device is on),
          ACTIVITY (blinks orange on wrong cable, off otherwise),
          LINK (solid green once at least one port is correctly wired). */}
      <Circle
        cx={faceX + 22}
        cy={y + 14}
        r={3}
        fill={powerLed}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={0.8}
      />
      <Circle
        cx={faceX + 32}
        cy={y + 14}
        r={3}
        fill={activityLed}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={0.8}
      />
      <Circle
        cx={faceX + 42}
        cy={y + 14}
        r={3}
        fill={linkLed}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={0.8}
      />

      {/* Label */}
      <SvgText
        x={faceX + 58}
        y={y + 18}
        fill="#0B1220"
        fontSize={11}
        fontWeight="900"
        letterSpacing={0.4}
      >
        {(device.label ?? device.id).toUpperCase()}
      </SvgText>
      <SvgText
        x={faceX + 58}
        y={y + 30}
        fill="rgba(11,18,32,0.55)"
        fontSize={7.5}
        fontWeight="700"
        letterSpacing={0.3}
      >
        {device.type.toUpperCase()}
      </SvgText>

      {/* Ports row */}
      {device.ports.map((port, pIdx) => {
        const isConsole = port.id === "console";
        const px = isConsole
          ? faceX + faceWidth - RACK_PORT.consoleFromRight
          : faceX + RACK_PORT.startOffset + pIdx * (RACK_PORT.width + RACK_PORT.gap);
        const py = y + RACK_PORT.topOffset;
        const isSelected =
          !!selectedPort &&
          selectedPort.deviceId === device.id &&
          selectedPort.port === port.id;
        const status: PortStatus =
          portStatus?.[`${device.id}.${port.id}`] ?? "idle";
        const linkLedColor = getPortLedColor(status, ledOn);

        return (
          <G key={port.id}>
            {/* Port outer bezel */}
            <Rect
              x={px - 1}
              y={py - 1}
              width={RACK_PORT.width + 2}
              height={RACK_PORT.height + 2}
              rx={3}
              fill="rgba(0,0,0,0.28)"
            />
            {/* Port body */}
            <Rect
              x={px}
              y={py}
              width={RACK_PORT.width}
              height={RACK_PORT.height}
              rx={2.5}
              fill="url(#port-body)"
              stroke={isSelected ? DC_COLORS.accent : isConsole ? DC_COLORS.console : "rgba(255,255,255,0.08)"}
              strokeWidth={isSelected ? 2 : 1}
            />
            {/* Port slot (RJ45 / console shape) */}
            {isConsole ? (
              <G>
                <Rect
                  x={px + 4}
                  y={py + 6}
                  width={RACK_PORT.width - 8}
                  height={RACK_PORT.height - 12}
                  rx={1}
                  fill="#0A0D12"
                />
                <SvgText
                  x={px + RACK_PORT.width / 2}
                  y={py + RACK_PORT.height - 2}
                  fill={DC_COLORS.console}
                  fontSize={5.5}
                  fontWeight="900"
                  textAnchor="middle"
                >
                  CONSOLE
                </SvgText>
              </G>
            ) : (
              <G>
                <Path
                  d={`M ${px + 4} ${py + 4} L ${px + RACK_PORT.width - 4} ${py + 4} L ${px + RACK_PORT.width - 4} ${py + RACK_PORT.height - 8} L ${px + RACK_PORT.width - 7} ${py + RACK_PORT.height - 4} L ${px + 7} ${py + RACK_PORT.height - 4} L ${px + 4} ${py + RACK_PORT.height - 8} Z`}
                  fill="#0A0D12"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={0.5}
                />
                {/* Link LED above port — color depends on wiring status:
                    red blink = no cable, green solid = correct cable,
                    orange blink = wrong / unneeded cable. */}
                <Circle
                  cx={px + RACK_PORT.width / 2}
                  cy={py - 1.5}
                  r={1.6}
                  fill={linkLedColor}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={0.4}
                />
              </G>
            )}
          </G>
        );
      })}
    </G>
  );
}
