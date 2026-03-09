import type { ScoreLevel } from "@/lib/api";

export const SCORE_LEVEL_EMOJIS: Record<ScoreLevel, string> = {
  Bronze: "🥉",
  Prata: "🥈",
  Ouro: "🥇",
  Diamante: "💎",
};

export const SCORE_LEVEL_COLORS: Record<ScoreLevel, string> = {
  Bronze: "#CD7F32",
  Prata: "#C0C0C0",
  Ouro: "#FFD700",
  Diamante: "#00CED1",
};

export const SCORE_LEVEL_NAMES: Record<ScoreLevel, string> = {
  Bronze: "Bronze",
  Prata: "Prata",
  Ouro: "Ouro",
  Diamante: "Diamante",
};
