export type Language = 'javascript' | 'java' | 'csharp' | 'python' | 'typescript' | 'sql';

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
  | 'Objeto'
  // Java / C# types
  | 'Sintaxe'
  | 'Variáveis'
  | 'Controle de Fluxo'
  | 'Arrays'
  | 'Classes'
  | 'Métodos'
  | 'POO'
  | 'Collections'
  | 'Exceções'
  | 'Strings'
  | 'Operadores'
  | 'Estrutura'
  | 'LINQ'
  | 'Assincronismo'
  | 'Tipos'
  | 'Recursos'
  // Python / TypeScript types
  | 'Listas'
  | 'Dicionários'
  | 'Módulos'
  | 'Tipagem'
  | 'Arquivos'
  | 'Generics'
  // SQL types
  | 'SELECT'
  | 'WHERE'
  | 'ORDER BY'
  | 'Funções de Agregação'
  | 'DISTINCT'
  | 'LIMIT'
  | 'INSERT'
  | 'DELETE'
  | 'GROUP BY'
  | 'JOIN'
  | 'HAVING'
  | 'UPDATE'
  | 'Alias'
  | 'Subquery'
  | 'CASE WHEN'
  | 'Window Function'
  | 'CTE'
  | 'CTE Recursiva';

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
  /**
   * Per-exercise label overrides for editable tokens.
   * e.g. { "id_funcname": "saudacao", "id_param": "nome" }
   */
  tokenLabels?: Record<string, string>;
};

export type PlacedToken = {
  instanceId: string;
  tokenId: string;
  customLabel?: string;
};
