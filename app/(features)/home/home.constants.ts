import { type ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type HomeFeatureItem = {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  text: string;
};

export const HOME_FEATURES: HomeFeatureItem[] = [
  { icon: "bug", text: "Ache o Erro: identifique e corrija bugs em códigos reais" },
  { icon: "brain", text: "Aprendizado adaptativo com repetição espaçada (SRS)" },
  { icon: "server-network", text: "Data Center Builder: simule o cabeamento de racks reais" },
  { icon: "lightbulb-on", text: "Dicas de especialistas e explicações detalhadas" },
  { icon: "code-json", text: "Exercícios de código com drag-and-drop interativo" },
  { icon: "shield-search", text: "Gestão de Incidentes: resolva chamados sob pressão" },
  { icon: "timer-check", text: "Gestão de SLA em incidentes críticos" },
  { icon: "book-open-variant", text: "Glossário interativo com termos técnicos de TI" },
  { icon: "trophy-variant", text: "Medalhas: Bronze, Prata, Ouro e Diamante" },
  { icon: "lightning-bolt", text: "Pontuação por acertos e velocidade de resposta" },
  { icon: "google-analytics", text: "Progresso detalhado por categoria e nível" },
  { icon: "school", text: "Quizzes técnicos cobrindo Redes, Cloud e Segurança" },
  { icon: "chart-bell-curve", text: "Ranking comunitário por nível de experiência" },
  { icon: "restart", text: "Retome lições de onde parou automaticamente" },
  { icon: "timer-outline", text: "Temporizador por questão em tempo real" },
  { icon: "map-marker-path", text: "Trilhas de aprendizado guiadas por especialistas" },
];
