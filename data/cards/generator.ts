/**
 * generator.ts — tipos e utilitários de cards
 *
 * Os cards agora são armazenados no Firestore (coleção "cards").
 * Este módulo exporta apenas os tipos públicos e funções utilitárias
 * puras (shuffle / select) reutilizadas pelo restante do app.
 *
 * Para funções que buscam/contam cards no Firestore, veja lib/api.ts.
 */

import type { UserLevel } from "@/lib/api";

// ---------------------------------------------------------------------------
// Tipos publicos
// ---------------------------------------------------------------------------

export type SeedCard = {
  q: string;
  o: [string, string, string, string];
  c: number;
  e: string;
  x: string;
};

export type GeneratedCard = {
  id: string;
  track: string;
  category: string;
  difficulty: UserLevel;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  example: string;
};

// ---------------------------------------------------------------------------
// Funcoes auxiliares
// ---------------------------------------------------------------------------

/**
 * Fisher-Yates shuffle algorithm para embaralhar um array
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Embaralha as opções de um card mantendo o índice correto atualizado
 */
export function shuffleCardOptions(card: GeneratedCard): GeneratedCard {
  // Cria um array com os índices originais
  const indices = [0, 1, 2, 3];
  const shuffledIndices = shuffle(indices);

  // Mapeia as opções de acordo com os novos índices
  const newOptions: [string, string, string, string] = [
    card.options[shuffledIndices[0]],
    card.options[shuffledIndices[1]],
    card.options[shuffledIndices[2]],
    card.options[shuffledIndices[3]],
  ];

  // Encontra a nova posição da resposta correta
  const newCorrectIndex = shuffledIndices.indexOf(card.correctIndex);

  return {
    ...card,
    options: newOptions,
    correctIndex: newCorrectIndex,
  };
}

/**
 * Seleciona exatamente N cards aleatórios de um array e os embaralha
 */
export function selectRandomCards<T>(cards: T[], limit: number): T[] {
  if (cards.length <= limit) {
    return shuffle(cards);
  }

  // Embaralha e pega apenas os primeiros N
  return shuffle(cards).slice(0, limit);
}
