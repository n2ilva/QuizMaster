export type Language = 'javascript' | 'java' | 'csharp';

export type TokenCategory =
  | 'keyword'
  | 'symbol'
  | 'identifier'
  | 'literal'
  | 'type'
  | 'modifier'
  | 'operator';

export type Difficulty = 'iniciante' | 'intermediário' | 'avançado';

export type ExerciseType =
  | 'Classe'
  | 'Função'
  | 'Array'
  | 'Método'
  | 'Namespace'
  | 'Interface'
  | 'Loop'
  | 'Condicional'
  | 'Objeto';

export type SyntaxToken = {
  id: string;
  label: string;
  category: TokenCategory;
  /** If true, the user can rename this token (e.g. class name, variable name) */
  editable?: boolean;
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  language: Language;
  difficulty: Difficulty;
  exerciseType: ExerciseType;
  /** Only the token IDs relevant to this exercise (subset shown in palette) */
  availableTokenIds: string[];
  /** The ordered list of token IDs that form the correct solution */
  solution: string[];
  hints?: string[];
};

export type PlacedToken = {
  instanceId: string;
  tokenId: string;
  customLabel?: string;
};
