import { DC_CABLE_VISUALS } from "./datacenter-builder.constants";
import type { Cable } from "./datacenter-builder.types";

/**
 * Maps a device id/type to a MaterialCommunityIcons glyph.
 * Keeps the fallback chain readable and centralized.
 */
export function getDeviceIcon(deviceId: string, type: string): string {
  const id = deviceId.toLowerCase();

  if (id.includes("modem") || id.includes("isp")) return "router-wireless";
  if (id.includes("router") || id.includes("mikrotik"))
    return "router-wireless";
  if (
    id.includes("fw") ||
    id.includes("firewall") ||
    id.includes("fortinet") ||
    id.includes("paloalto")
  ) {
    return "shield-lock";
  }
  if (id.includes("switch")) return "switch";
  if (
    id.includes("storage") ||
    id.includes("nas") ||
    id.includes("synology") ||
    id.includes("netapp")
  ) {
    return "database";
  }
  if (id.includes("camera")) return "video-outline";
  if (id.includes("voip")) return "phone-voip";
  if (id.includes("ups") || id.includes("apc") || id.includes("eaton")) {
    return "battery-charging";
  }
  if (id.includes("ap_")) return "wifi";

  switch (type) {
    case "modem":
      return "router-wireless";
    case "network":
      return "router";
    case "security":
      return "security";
    case "storage":
      return "database";
    case "compute":
      return "server";
    case "power":
      return "battery";
    case "wireless":
      return "wifi";
    default:
      return "server-network";
  }
}

/**
 * Looks up the visual color for a given cable id. Works both against the
 * data file's cable definition and the visual token table — whichever
 * resolves first wins, with a safe neutral fallback.
 */
export function getCableColor(
  cableId: string,
  cableTypes: Cable[] = [],
): string {
  const visual = DC_CABLE_VISUALS[cableId];
  if (visual) return visual.color;

  const data = cableTypes.find((c) => c.id === cableId);
  if (data) {
    const byType = DC_CABLE_VISUALS[data.type];
    if (byType) return byType.color;
  }

  return DC_CABLE_VISUALS.ethernet.color;
}

/**
 * Resolves the label/description for a cable, falling back to the raw data
 * so admin-defined cables still render something useful.
 */
export function getCableVisual(cable: Cable) {
  const known = DC_CABLE_VISUALS[cable.id] ?? DC_CABLE_VISUALS[cable.type];
  return {
    color: known?.color ?? DC_CABLE_VISUALS.ethernet.color,
    label: known?.label ?? cable.id.toUpperCase(),
    description: known?.description ?? cable.speed ?? cable.type,
  };
}

/**
 * Generates a short random id for an active connection.
 * Uses Math.random with a prefix to avoid collisions inside the same session.
 */
export function makeConnectionId(): string {
  return `conn_${Math.random().toString(36).slice(2, 10)}`;
}
