import { type TrackIcon } from "@/constants/track-styles";

export type HomeFeatureItem = {
  icon: TrackIcon;
  text: string;
};

export const HOME_FEATURES: HomeFeatureItem[] = [
  { icon: "school", text: "Quizzes técnicos com repetição espaçada" },
  { icon: "xml", text: "Prática de Código: monte blocos de sintaxe interativos" },
  { icon: "shield-search", text: "Gestão de Incidentes: resolva chamados sob pressão" },
  { icon: "server-network", text: "Data Center Builder: simule o cabeamento de racks reais" },
  { icon: "book-open-variant", text: "Glossário interativo com termos técnicos" },
  { icon: "lightbulb-on", text: "Explicações detalhadas e exemplos práticos" },
  { icon: "trophy-variant", text: "Medalhas: Bronze, Prata, Ouro e Diamante" },
  { icon: "chart-bell-curve", text: "Ranking comunitário por nível de medalha" },
  { icon: "lightning-bolt", text: "Pontuação por acertos e velocidade de resposta" },
  { icon: "timer-outline", text: "Temporizador por questão em tempo real" },
  { icon: "code-json", text: "Exercícios de código com drag-and-drop interativo" },
  { icon: "restart", text: "Retome lições de onde parou" },
  { icon: "google-analytics", text: "Progresso detalhado por categoria e nível" },
  { icon: "brain", text: "Repetição espaçada adaptativa (SRS)" },
];
