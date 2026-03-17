import type { ComponentProps } from "react";

import type MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type TrackIcon = ComponentProps<typeof MaterialIcons>["name"];

export const TRACK_STYLE_FALLBACK: { icon: TrackIcon; color: string } = {
  icon: "school",
  color: "#3F51B5",
};

export const trackStyles: Record<string, { icon: TrackIcon; color: string }> = {
  cloud: { icon: "cloud-queue", color: "#0EA5E9" },
  "engenharia-de-software": { icon: "terminal", color: "#3F51B5" },
  ingles: { icon: "translate", color: "#6366F1" },
  "linguagens-de-programacao": { icon: "code", color: "#14B8A6" },
  "machine-learning-e-ia": { icon: "psychology", color: "#8B5CF6" },
  matematica: { icon: "functions", color: "#F59E0B" },
  portugues: { icon: "menu-book", color: "#EF4444" },
  "rede-de-computadores": { icon: "lan", color: "#10B981" },
  "seguranca-da-informacao": { icon: "shield", color: "#EC4899" },
  "banco-de-dados": { icon: "storage", color: "#F97316" },
  "sistemas-operacionais": { icon: "computer", color: "#6D28D9" },
  "governanca-de-ti": { icon: "account-balance", color: "#0D9488" },
};
