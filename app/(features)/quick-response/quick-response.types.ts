export type QuickResponseDifficulty = 'Baixa' | 'Urgente' | 'Crítica';


export type QuickResponseContext = {
  ticket_id?: string;       // ex: "#INC-2024-0841"
  system?: string;          // ex: "ERP Totvs Protheus v12"
  affected_users?: string;  // ex: "~200 usuários do financeiro"
  opened_by?: string;       // ex: "Maria Silva — Gerente Financeiro"
  priority_sla?: string;    // ex: "P1 — SLA: 4h" (referência no ITSM)
  log_snippet?: string;     // trecho de log real (opcional)
  topology_hint?: string;   // dica de topologia/contexto de ambiente
};

export type QuickResponseOption = {
  id: string;
  text: string;
  is_correct: boolean;
  feedback?: string;
};

export type QuickResponseExercise = {
  id: string;
  level: QuickResponseDifficulty;
  alert: string;
  context?: QuickResponseContext;
  actions: QuickResponseOption[];
  success_message: string;
  /** Explicação técnica aprofundada exibida no gabarito pós-resolução */
  explanation?: string;
  /** Passo a passo correto do runbook (exibido após acerto ou erro) */
  runbook_steps?: string[];
};

export type QuickResponseCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
  exercises: QuickResponseExercise[];
};

export type QuickResponseData = {
  game: string;
  version: string;
  categories: QuickResponseCategory[];
};

