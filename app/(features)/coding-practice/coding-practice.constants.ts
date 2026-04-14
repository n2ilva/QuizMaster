import { type Language, type SyntaxToken } from './coding-practice.types';

// ─────────────────────────────────────────────
// Syntax Tokens per language
// ─────────────────────────────────────────────

export const JAVASCRIPT_TOKENS: SyntaxToken[] = [
  // Keywords
  { id: 'kw_class', label: 'class', category: 'keyword' },
  { id: 'kw_function', label: 'function', category: 'keyword' },
  { id: 'kw_const', label: 'const', category: 'keyword' },
  { id: 'kw_let', label: 'let', category: 'keyword' },
  { id: 'kw_var', label: 'var', category: 'keyword' },
  { id: 'kw_return', label: 'return', category: 'keyword' },
  { id: 'kw_new', label: 'new', category: 'keyword' },
  { id: 'kw_this', label: 'this', category: 'keyword' },
  { id: 'kw_extends', label: 'extends', category: 'keyword' },
  { id: 'kw_if', label: 'if', category: 'keyword' },
  { id: 'kw_else', label: 'else', category: 'keyword' },
  { id: 'kw_for', label: 'for', category: 'keyword' },
  { id: 'kw_while', label: 'while', category: 'keyword' },
  { id: 'kw_constructor', label: 'constructor', category: 'keyword' },
  // Symbols
  { id: 'sym_open_brace', label: '{', category: 'symbol' },
  { id: 'sym_close_brace', label: '}', category: 'symbol' },
  { id: 'sym_open_paren', label: '(', category: 'symbol' },
  { id: 'sym_close_paren', label: ')', category: 'symbol' },
  { id: 'sym_open_bracket', label: '[', category: 'symbol' },
  { id: 'sym_close_bracket', label: ']', category: 'symbol' },
  { id: 'sym_semicolon', label: ';', category: 'symbol' },
  { id: 'sym_comma', label: ',', category: 'symbol' },
  { id: 'sym_dot', label: '.', category: 'symbol' },
  { id: 'sym_equals', label: '=', category: 'operator' },
  { id: 'sym_arrow', label: '=>', category: 'operator' },
  // Editable identifiers
  { id: 'id_classname', label: 'NomeClasse', category: 'identifier', editable: true },
  { id: 'id_funcname', label: 'nomeFuncao', category: 'identifier', editable: true },
  { id: 'id_varname', label: 'nomeVariavel', category: 'identifier', editable: true },
  { id: 'id_param', label: 'parametro', category: 'identifier', editable: true },
  { id: 'id_propname', label: 'propriedade', category: 'identifier', editable: true },
  // Literals
  { id: 'lit_string', label: '"texto"', category: 'literal', editable: true },
  { id: 'lit_number', label: '0', category: 'literal', editable: true },
  { id: 'lit_true', label: 'true', category: 'literal' },
  { id: 'lit_false', label: 'false', category: 'literal' },
  { id: 'lit_null', label: 'null', category: 'literal' },
];

export const JAVA_TOKENS: SyntaxToken[] = [
  // Keywords
  { id: 'kw_class', label: 'class', category: 'keyword' },
  { id: 'kw_public', label: 'public', category: 'modifier' },
  { id: 'kw_private', label: 'private', category: 'modifier' },
  { id: 'kw_protected', label: 'protected', category: 'modifier' },
  { id: 'kw_static', label: 'static', category: 'modifier' },
  { id: 'kw_final', label: 'final', category: 'modifier' },
  { id: 'kw_void', label: 'void', category: 'type' },
  { id: 'kw_new', label: 'new', category: 'keyword' },
  { id: 'kw_return', label: 'return', category: 'keyword' },
  { id: 'kw_extends', label: 'extends', category: 'keyword' },
  { id: 'kw_implements', label: 'implements', category: 'keyword' },
  { id: 'kw_interface', label: 'interface', category: 'keyword' },
  { id: 'kw_if', label: 'if', category: 'keyword' },
  { id: 'kw_else', label: 'else', category: 'keyword' },
  { id: 'kw_for', label: 'for', category: 'keyword' },
  { id: 'kw_while', label: 'while', category: 'keyword' },
  { id: 'kw_this', label: 'this', category: 'keyword' },
  { id: 'kw_super', label: 'super', category: 'keyword' },
  // Types
  { id: 'type_int', label: 'int', category: 'type' },
  { id: 'type_string', label: 'String', category: 'type' },
  { id: 'type_boolean', label: 'boolean', category: 'type' },
  { id: 'type_double', label: 'double', category: 'type' },
  // Symbols
  { id: 'sym_open_brace', label: '{', category: 'symbol' },
  { id: 'sym_close_brace', label: '}', category: 'symbol' },
  { id: 'sym_open_paren', label: '(', category: 'symbol' },
  { id: 'sym_close_paren', label: ')', category: 'symbol' },
  { id: 'sym_semicolon', label: ';', category: 'symbol' },
  { id: 'sym_comma', label: ',', category: 'symbol' },
  { id: 'sym_dot', label: '.', category: 'symbol' },
  { id: 'sym_equals', label: '=', category: 'operator' },
  { id: 'sym_at', label: '@', category: 'symbol' },
  // Editable identifiers
  { id: 'id_classname', label: 'NomeClasse', category: 'identifier', editable: true },
  { id: 'id_methodname', label: 'nomeMetodo', category: 'identifier', editable: true },
  { id: 'id_varname', label: 'nomeVariavel', category: 'identifier', editable: true },
  { id: 'id_param', label: 'parametro', category: 'identifier', editable: true },
  // Literals
  { id: 'lit_string', label: '"texto"', category: 'literal', editable: true },
  { id: 'lit_number', label: '0', category: 'literal', editable: true },
  { id: 'lit_true', label: 'true', category: 'literal' },
  { id: 'lit_false', label: 'false', category: 'literal' },
  { id: 'lit_null', label: 'null', category: 'literal' },
];

export const CSHARP_TOKENS: SyntaxToken[] = [
  // Keywords
  { id: 'kw_class', label: 'class', category: 'keyword' },
  { id: 'kw_namespace', label: 'namespace', category: 'keyword' },
  { id: 'kw_using', label: 'using', category: 'keyword' },
  { id: 'kw_public', label: 'public', category: 'modifier' },
  { id: 'kw_private', label: 'private', category: 'modifier' },
  { id: 'kw_protected', label: 'protected', category: 'modifier' },
  { id: 'kw_static', label: 'static', category: 'modifier' },
  { id: 'kw_readonly', label: 'readonly', category: 'modifier' },
  { id: 'kw_override', label: 'override', category: 'modifier' },
  { id: 'kw_virtual', label: 'virtual', category: 'modifier' },
  { id: 'kw_abstract', label: 'abstract', category: 'modifier' },
  { id: 'kw_void', label: 'void', category: 'type' },
  { id: 'kw_new', label: 'new', category: 'keyword' },
  { id: 'kw_return', label: 'return', category: 'keyword' },
  { id: 'kw_base', label: 'base', category: 'keyword' },
  { id: 'kw_this', label: 'this', category: 'keyword' },
  { id: 'kw_if', label: 'if', category: 'keyword' },
  { id: 'kw_else', label: 'else', category: 'keyword' },
  { id: 'kw_for', label: 'for', category: 'keyword' },
  { id: 'kw_foreach', label: 'foreach', category: 'keyword' },
  { id: 'kw_in', label: 'in', category: 'keyword' },
  { id: 'kw_var', label: 'var', category: 'keyword' },
  { id: 'kw_get', label: 'get', category: 'keyword' },
  { id: 'kw_set', label: 'set', category: 'keyword' },
  // Types
  { id: 'type_int', label: 'int', category: 'type' },
  { id: 'type_string', label: 'string', category: 'type' },
  { id: 'type_bool', label: 'bool', category: 'type' },
  { id: 'type_double', label: 'double', category: 'type' },
  { id: 'type_list', label: 'List<T>', category: 'type', editable: true },
  // Symbols
  { id: 'sym_open_brace', label: '{', category: 'symbol' },
  { id: 'sym_close_brace', label: '}', category: 'symbol' },
  { id: 'sym_open_paren', label: '(', category: 'symbol' },
  { id: 'sym_close_paren', label: ')', category: 'symbol' },
  { id: 'sym_semicolon', label: ';', category: 'symbol' },
  { id: 'sym_comma', label: ',', category: 'symbol' },
  { id: 'sym_dot', label: '.', category: 'symbol' },
  { id: 'sym_equals', label: '=', category: 'operator' },
  { id: 'sym_lambda', label: '=>', category: 'operator' },
  // Editable identifiers
  { id: 'id_classname', label: 'NomeClasse', category: 'identifier', editable: true },
  { id: 'id_methodname', label: 'NomeMetodo', category: 'identifier', editable: true },
  { id: 'id_varname', label: 'nomeVariavel', category: 'identifier', editable: true },
  { id: 'id_param', label: 'parametro', category: 'identifier', editable: true },
  // Literals
  { id: 'lit_string', label: '"texto"', category: 'literal', editable: true },
  { id: 'lit_number', label: '0', category: 'literal', editable: true },
  { id: 'lit_true', label: 'true', category: 'literal' },
  { id: 'lit_false', label: 'false', category: 'literal' },
  { id: 'lit_null', label: 'null', category: 'literal' },
];

export const LANGUAGE_TOKENS: Record<Language, SyntaxToken[]> = {
  javascript: JAVASCRIPT_TOKENS,
  java: JAVA_TOKENS,
  csharp: CSHARP_TOKENS,
};

// ─────────────────────────────────────────────
// Token category colors
// ─────────────────────────────────────────────
export const TOKEN_CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  keyword:    { bg: '#1E1B4B', border: '#6366F1', text: '#A5B4FC' },
  modifier:   { bg: '#1A1040', border: '#8B5CF6', text: '#C4B5FD' },
  type:       { bg: '#042F2E', border: '#14B8A6', text: '#5EEAD4' },
  symbol:     { bg: '#1C1917', border: '#78716C', text: '#D4CCC7' },
  operator:   { bg: '#172554', border: '#3B82F6', text: '#93C5FD' },
  identifier: { bg: '#052E16', border: '#22C55E', text: '#86EFAC' },
  literal:    { bg: '#431407', border: '#F97316', text: '#FED7AA' },
};

// ─────────────────────────────────────────────
// Language metadata
// ─────────────────────────────────────────────
export type LanguageInfo = {
  id: Language;
  label: string;
  color: string;
  accent: string;
  icon: string; // MaterialCommunityIcons name
};

export const LANGUAGES: LanguageInfo[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    color: '#854d0e',
    accent: '#FDE047',
    icon: 'language-javascript',
  },
  {
    id: 'java',
    label: 'Java',
    color: '#7c2d12',
    accent: '#FB923C',
    icon: 'language-java',
  },
  {
    id: 'csharp',
    label: 'C#',
    color: '#312e81',
    accent: '#818CF8',
    icon: 'language-csharp',
  },
];
