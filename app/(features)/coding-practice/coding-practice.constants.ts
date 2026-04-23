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
  { id: 'kw_async', label: 'async', category: 'keyword' },
  { id: 'kw_await', label: 'await', category: 'keyword' },
  { id: 'kw_super', label: 'super', category: 'keyword' },
  { id: 'kw_switch', label: 'switch', category: 'keyword' },
  { id: 'kw_case', label: 'case', category: 'keyword' },
  { id: 'kw_break', label: 'break', category: 'keyword' },
  { id: 'kw_try', label: 'try', category: 'keyword' },
  { id: 'kw_catch', label: 'catch', category: 'keyword' },
  { id: 'kw_finally', label: 'finally', category: 'keyword' },
  { id: 'kw_throw', label: 'throw', category: 'keyword' },
  { id: 'kw_export', label: 'export', category: 'keyword' },
  { id: 'kw_import', label: 'import', category: 'keyword' },
  { id: 'kw_default', label: 'default', category: 'keyword' },
  { id: 'kw_from', label: 'from', category: 'keyword' },
  { id: 'kw_yield', label: 'yield', category: 'keyword' },
  { id: 'kw_of', label: 'of', category: 'keyword' },
  { id: 'kw_in', label: 'in', category: 'keyword' },
  { id: 'kw_get', label: 'get', category: 'keyword' },
  { id: 'kw_set', label: 'set', category: 'keyword' },
  { id: 'kw_as', label: 'as', category: 'keyword' },
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
  { id: 'sym_colon', label: ':', category: 'symbol' },
  { id: 'sym_equals', label: '=', category: 'operator' },
  { id: 'sym_arrow', label: '=>', category: 'operator' },
  { id: 'sym_gte', label: '>=', category: 'operator' },
  { id: 'sym_lt', label: '<', category: 'operator' },
  { id: 'sym_increment', label: '++', category: 'operator' },
  { id: 'sym_asterisk', label: '*', category: 'operator' },
  { id: 'sym_plus', label: '+', category: 'operator' },
  { id: 'sym_percent', label: '%', category: 'operator' },
  { id: 'sym_double_equals', label: '===', category: 'operator' },
  { id: 'sym_spread', label: '...', category: 'operator' },
  { id: 'sym_opt_chain', label: '?.', category: 'operator' },
  { id: 'sym_nullish', label: '??', category: 'operator' },
  { id: 'sym_question', label: '?', category: 'symbol' },
  { id: 'sym_backtick', label: '`', category: 'symbol' },
  { id: 'sym_dollar_brace', label: '${', category: 'symbol' },
  // Editable identifiers — generic (label overridden per-exercise via tokenLabels)
  { id: 'id_classname', label: 'NomeClasse', category: 'identifier', editable: true },
  { id: 'id_funcname', label: 'nomeFuncao', category: 'identifier', editable: true },
  { id: 'id_varname', label: 'nomeVariavel', category: 'identifier', editable: true },
  { id: 'id_param', label: 'parâmetro 1', category: 'identifier', editable: true },
  { id: 'id_param2', label: 'parâmetro 2', category: 'identifier', editable: true },
  { id: 'id_propname', label: 'propriedade', category: 'identifier', editable: true },
  { id: 'id_methodname', label: 'nomeMetodo', category: 'identifier', editable: true },
  { id: 'id_arrayname', label: 'nomeArray', category: 'identifier', editable: true },
  { id: 'id_newarray', label: 'novoArray', category: 'identifier', editable: true },
  { id: 'id_array1', label: 'array1', category: 'identifier', editable: true },
  { id: 'id_array2', label: 'array2', category: 'identifier', editable: true },
  { id: 'id_objname', label: 'nomeObjeto', category: 'identifier', editable: true },
  { id: 'id_prop1', label: 'propriedade1', category: 'identifier', editable: true },
  { id: 'id_prop2', label: 'propriedade2', category: 'identifier', editable: true },
  { id: 'id_condition', label: 'condicao', category: 'identifier', editable: true },
  { id: 'id_result', label: 'resultado', category: 'identifier', editable: true },
  { id: 'id_parentclass', label: 'ClassePai', category: 'identifier', editable: true },
  { id: 'id_method', label: 'nomeMetodo', category: 'identifier', editable: true },
  { id: 'id_acc', label: 'acc', category: 'identifier', editable: true },
  { id: 'id_curr', label: 'curr', category: 'identifier', editable: true },
  { id: 'id_callfunc', label: 'funcao', category: 'identifier', editable: true },
  { id: 'id_func', label: 'funcao', category: 'identifier', editable: true },
  { id: 'id_var', label: 'variavel', category: 'identifier', editable: true },
  { id: 'id_res', label: 'resultado', category: 'identifier', editable: true },
  { id: 'id_p1', label: 'param1', category: 'identifier', editable: true },
  { id: 'id_p2', label: 'param2', category: 'identifier', editable: true },
  { id: 'id_cond', label: 'condicao', category: 'identifier', editable: true },
  { id: 'id_const', label: 'constante', category: 'identifier', editable: true },
  { id: 'id_arr', label: 'array', category: 'identifier', editable: true },
  { id: 'id_iter', label: 'item', category: 'identifier', editable: true },
  { id: 'id_class', label: 'Classe', category: 'identifier', editable: true },
  { id: 'id_getter', label: 'getter', category: 'identifier', editable: true },
  { id: 'id_obj', label: 'objeto', category: 'identifier', editable: true },
  { id: 'id_global', label: 'global', category: 'identifier', editable: true },
  { id: 'id_alias', label: 'alias', category: 'identifier', editable: true },
  { id: 'id_parent', label: 'Pai', category: 'identifier', editable: true },
  { id: 'id_interp', label: 'valor', category: 'identifier', editable: true },
  // Literals — generic
  { id: 'lit_string', label: '"texto"', category: 'literal', editable: true },
  { id: 'lit_string_1', label: '"valor1"', category: 'literal', editable: true },
  { id: 'lit_string_2', label: '"valor2"', category: 'literal', editable: true },
  { id: 'lit_string_3', label: '"valor3"', category: 'literal', editable: true },
  { id: 'lit_string_adulto', label: '"adulto"', category: 'literal', editable: true },
  { id: 'lit_string_menor', label: '"menor"', category: 'literal', editable: true },
  { id: 'lit_string_true', label: '"verdadeiro"', category: 'literal', editable: true },
  { id: 'lit_string_false', label: '"falso"', category: 'literal', editable: true },
  { id: 'lit_number', label: '0', category: 'literal', editable: true },
  { id: 'lit_number_0', label: '0', category: 'literal', editable: true },
  { id: 'lit_number_2', label: '2', category: 'literal', editable: true },
  { id: 'lit_number_5', label: '5', category: 'literal', editable: true },
  { id: 'lit_ms', label: '1000', category: 'literal', editable: true },
  { id: 'lit_url', label: '"url"', category: 'literal', editable: true },
  { id: 'lit_prop', label: '"prop"', category: 'literal', editable: true },
  { id: 'lit_str', label: '"texto"', category: 'literal', editable: true },
  { id: 'lit_path', label: '"caminho"', category: 'literal', editable: true },
  { id: 'lit_str_part', label: '"parte"', category: 'literal', editable: true },
  { id: 'lit_default', label: '"padrao"', category: 'literal', editable: true },
  { id: 'lit_query', label: '".classe"', category: 'literal', editable: true },
  { id: 'lit_key', label: '"chave"', category: 'literal', editable: true },
  { id: 'lit_val', label: '"valor"', category: 'literal', editable: true },
  { id: 'lit_true', label: 'true', category: 'literal' },
  { id: 'lit_false', label: 'false', category: 'literal' },
  { id: 'lit_null', label: 'null', category: 'literal' },
  // Standard Globals
  { id: 'id_promise', label: 'Promise', category: 'identifier' },
  { id: 'id_json', label: 'JSON', category: 'identifier' },
  { id: 'id_console', label: 'console', category: 'identifier' },
  { id: 'id_window', label: 'window', category: 'identifier' },
  { id: 'id_document', label: 'document', category: 'identifier' },
  { id: 'id_error', label: 'Error', category: 'identifier' },
];

export const JAVA_TOKENS: SyntaxToken[] = [
  // Keywords
  { id: 'kw_class', label: 'class', category: 'keyword' },
  { id: 'kw_if', label: 'if', category: 'keyword' },
  { id: 'kw_else', label: 'else', category: 'keyword' },
  { id: 'kw_for', label: 'for', category: 'keyword' },
  { id: 'kw_while', label: 'while', category: 'keyword' },
  { id: 'kw_return', label: 'return', category: 'keyword' },
  { id: 'kw_new', label: 'new', category: 'keyword' },
  { id: 'kw_this', label: 'this', category: 'keyword' },
  { id: 'kw_super', label: 'super', category: 'keyword' },
  { id: 'kw_switch', label: 'switch', category: 'keyword' },
  { id: 'kw_try', label: 'try', category: 'keyword' },
  { id: 'kw_catch', label: 'catch', category: 'keyword' },
  { id: 'kw_ext', label: 'extends', category: 'keyword' },
  { id: 'kw_impl', label: 'implements', category: 'keyword' },
  { id: 'kw_final', label: 'final', category: 'modifier' },
  // Modifiers
  { id: 'kw_mod', label: 'public', category: 'modifier' },
  { id: 'kw_pub', label: 'public', category: 'modifier' },
  { id: 'kw_stat', label: 'static', category: 'modifier' },
  // Types
  { id: 'kw_void', label: 'void', category: 'type' },
  { id: 'kw_type', label: 'tipo', category: 'type', editable: true },
  { id: 'kw_ret', label: 'tipoRetorno', category: 'type', editable: true },
  { id: 'id_type', label: 'Tipo', category: 'type', editable: true },
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
  // Operators
  { id: 'op_assign', label: '=', category: 'operator' },
  { id: 'op_gte', label: '>=', category: 'operator' },
  { id: 'op_lt', label: '<', category: 'operator' },
  { id: 'op_eq', label: '==', category: 'operator' },
  { id: 'op_inc', label: '++', category: 'operator' },
  { id: 'op_plus', label: '+', category: 'operator' },
  // Editable identifiers
  { id: 'id_class', label: 'NomeClasse', category: 'identifier', editable: true },
  { id: 'id_out', label: 'out', category: 'identifier', editable: true },
  { id: 'id_method', label: 'metodo', category: 'identifier', editable: true },
  { id: 'id_var', label: 'variavel', category: 'identifier', editable: true },
  { id: 'id_name', label: 'nome', category: 'identifier', editable: true },
  { id: 'id_i', label: 'i', category: 'identifier', editable: true },
  { id: 'id_param', label: 'parametro', category: 'identifier', editable: true },
  { id: 'id_attr', label: 'atributo', category: 'identifier', editable: true },
  { id: 'id_list', label: 'lista', category: 'identifier', editable: true },
  { id: 'id_child', label: 'Filho', category: 'identifier', editable: true },
  { id: 'id_parent', label: 'Pai', category: 'identifier', editable: true },
  { id: 'id_inter', label: 'Interface', category: 'identifier', editable: true },
  { id: 'id_ex', label: 'Exception', category: 'identifier', editable: true },
  { id: 'id_res', label: 'resultado', category: 'identifier', editable: true },
  { id: 'id_a', label: 'a', category: 'identifier', editable: true },
  { id: 'id_b', label: 'b', category: 'identifier', editable: true },
  { id: 'id_main', label: 'main', category: 'identifier', editable: true },
  { id: 'id_n', label: 'n', category: 'identifier', editable: true },
  { id: 'id_arr', label: 'array', category: 'identifier', editable: true },
  { id: 'p1', label: 'param1', category: 'identifier', editable: true },
  { id: 'p2', label: 'param2', category: 'identifier', editable: true },
  // Literals
  { id: 'val_string', label: '"texto"', category: 'literal', editable: true },
  { id: 'val_str', label: '"texto"', category: 'literal', editable: true },
  { id: 'val_num', label: '0', category: 'literal', editable: true },
  { id: 'val', label: '0', category: 'literal', editable: true },
  { id: 'val_0', label: '0', category: 'literal', editable: true },
  { id: 'val_1', label: '1', category: 'literal', editable: true },
  { id: 'val_2', label: '2', category: 'literal', editable: true },
  { id: 'val_3', label: '3', category: 'literal', editable: true },
  { id: 'val_5', label: '5', category: 'literal', editable: true },
  { id: 'val_10', label: '10', category: 'literal', editable: true },
  { id: 'val_idx', label: '0', category: 'literal', editable: true },
  { id: 'lit_true', label: 'true', category: 'literal' },
  { id: 'lit_false', label: 'false', category: 'literal' },
  { id: 'lit_null', label: 'null', category: 'literal' },
];

export const CSHARP_TOKENS: SyntaxToken[] = [
  // Keywords
  { id: 'kw_class', label: 'class', category: 'keyword' },
  { id: 'kw_if', label: 'if', category: 'keyword' },
  { id: 'kw_else', label: 'else', category: 'keyword' },
  { id: 'kw_for', label: 'for', category: 'keyword' },
  { id: 'kw_foreach', label: 'foreach', category: 'keyword' },
  { id: 'kw_in', label: 'in', category: 'keyword' },
  { id: 'kw_var', label: 'var', category: 'keyword' },
  { id: 'kw_new', label: 'new', category: 'keyword' },
  { id: 'kw_return', label: 'return', category: 'keyword' },
  { id: 'kw_base', label: 'base', category: 'keyword' },
  { id: 'kw_this', label: 'this', category: 'keyword' },
  { id: 'kw_using', label: 'using', category: 'keyword' },
  { id: 'kw_ns', label: 'namespace', category: 'keyword' },
  { id: 'kw_interface', label: 'interface', category: 'keyword' },
  { id: 'kw_enum', label: 'enum', category: 'keyword' },
  { id: 'kw_struct', label: 'struct', category: 'keyword' },
  { id: 'kw_get', label: 'get', category: 'keyword' },
  { id: 'kw_set', label: 'set', category: 'keyword' },
  { id: 'kw_async', label: 'async', category: 'keyword' },
  { id: 'kw_null', label: 'null', category: 'keyword' },
  // Modifiers
  { id: 'kw_pub', label: 'public', category: 'modifier' },
  { id: 'kw_priv', label: 'private', category: 'modifier' },
  { id: 'kw_ro', label: 'readonly', category: 'modifier' },
  // Types
  { id: 'kw_void', label: 'void', category: 'type' },
  { id: 'kw_type', label: 'tipo', category: 'type', editable: true },
  { id: 'kw_type_str', label: 'string', category: 'type', editable: true },
  { id: 'kw_task', label: 'Task', category: 'type', editable: true },
  // Symbols
  { id: 'sym_open_brace', label: '{', category: 'symbol' },
  { id: 'sym_close_brace', label: '}', category: 'symbol' },
  { id: 'sym_open_paren', label: '(', category: 'symbol' },
  { id: 'sym_close_paren', label: ')', category: 'symbol' },
  { id: 'sym_semicolon', label: ';', category: 'symbol' },
  { id: 'sym_comma', label: ',', category: 'symbol' },
  { id: 'sym_dot', label: '.', category: 'symbol' },
  { id: 'sym_colon', label: ':', category: 'symbol' },
  // Operators
  { id: 'op_assign', label: '=', category: 'operator' },
  { id: 'op_eq', label: '==', category: 'operator' },
  { id: 'op_lambda', label: '=>', category: 'operator' },
  { id: 'op_gt', label: '>', category: 'operator' },
  { id: 'op_quest', label: '?', category: 'operator' },
  { id: 'op_mult', label: '*', category: 'operator' },
  { id: 'op_interp', label: '$', category: 'operator' },
  // Editable identifiers
  { id: 'id_class', label: 'NomeClasse', category: 'identifier', editable: true },
  { id: 'id_method', label: 'metodo', category: 'identifier', editable: true },
  { id: 'id_var', label: 'variavel', category: 'identifier', editable: true },
  { id: 'id_name', label: 'nome', category: 'identifier', editable: true },
  { id: 'id_item', label: 'item', category: 'identifier', editable: true },
  { id: 'id_coll', label: 'colecao', category: 'identifier', editable: true },
  { id: 'id_p', label: 'parametro', category: 'identifier', editable: true },
  { id: 'id_list', label: 'lista', category: 'identifier', editable: true },
  { id: 'id_m', label: 'metodo', category: 'identifier', editable: true },
  { id: 'id_x', label: 'x', category: 'identifier', editable: true },
  { id: 'id_ctor', label: 'Construtor', category: 'identifier', editable: true },
  { id: 'id_dict', label: 'dicionario', category: 'identifier', editable: true },
  // Literals
  { id: 'val_string', label: '"texto"', category: 'literal', editable: true },
  { id: 'val_str', label: '"texto"', category: 'literal', editable: true },
  { id: 'val_def', label: '"default"', category: 'literal', editable: true },
  { id: 'val_10', label: '10', category: 'literal', editable: true },
  { id: 'val_k', label: '0', category: 'literal', editable: true },
  { id: 'val_v', label: '"valor"', category: 'literal', editable: true },
  { id: 'v1', label: 'valor1', category: 'literal', editable: true },
  { id: 'v2', label: 'valor2', category: 'literal', editable: true },
  { id: 'lit_true', label: 'true', category: 'literal' },
  { id: 'lit_false', label: 'false', category: 'literal' },
  { id: 'lit_null', label: 'null', category: 'literal' },
];

export const PYTHON_TOKENS: SyntaxToken[] = [
  // Keywords
  { id: 'kw_def', label: 'def', category: 'keyword' },
  { id: 'kw_if', label: 'if', category: 'keyword' },
  { id: 'kw_else', label: 'else', category: 'keyword' },
  { id: 'kw_for', label: 'for', category: 'keyword' },
  { id: 'kw_in', label: 'in', category: 'keyword' },
  { id: 'kw_ret', label: 'return', category: 'keyword' },
  { id: 'kw_class', label: 'class', category: 'keyword' },
  { id: 'kw_imp', label: 'import', category: 'keyword' },
  { id: 'kw_lam', label: 'lambda', category: 'keyword' },
  { id: 'kw_try', label: 'try', category: 'keyword' },
  { id: 'kw_exc', label: 'except', category: 'keyword' },
  { id: 'kw_and', label: 'and', category: 'keyword' },
  { id: 'kw_with', label: 'with', category: 'keyword' },
  { id: 'kw_as', label: 'as', category: 'keyword' },
  // Symbols
  { id: 'sym_open_paren', label: '(', category: 'symbol' },
  { id: 'sym_close_paren', label: ')', category: 'symbol' },
  { id: 'sym_open_bracket', label: '[', category: 'symbol' },
  { id: 'sym_close_bracket', label: ']', category: 'symbol' },
  { id: 'sym_open_brace', label: '{', category: 'symbol' },
  { id: 'sym_close_brace', label: '}', category: 'symbol' },
  { id: 'sym_colon', label: ':', category: 'symbol' },
  { id: 'sym_comma', label: ',', category: 'symbol' },
  { id: 'sym_dot', label: '.', category: 'symbol' },
  // Operators
  { id: 'op_assign', label: '=', category: 'operator' },
  { id: 'op_gt', label: '>', category: 'operator' },
  { id: 'op_mult', label: '*', category: 'operator' },
  // Identifiers
  { id: 'id_func', label: 'funcao', category: 'identifier', editable: true },
  { id: 'id_name', label: 'nome', category: 'identifier', editable: true },
  { id: 'id_var', label: 'variavel', category: 'identifier', editable: true },
  { id: 'id_list', label: 'lista', category: 'identifier', editable: true },
  { id: 'id_p', label: 'parametro', category: 'identifier', editable: true },
  { id: 'id_item', label: 'item', category: 'identifier', editable: true },
  { id: 'id_init', label: '__init__', category: 'identifier', editable: true },
  { id: 'id_self', label: 'self', category: 'identifier', editable: true },
  { id: 'id_meth', label: 'metodo', category: 'identifier', editable: true },
  { id: 'id_mod', label: 'modulo', category: 'identifier', editable: true },
  { id: 'id_x', label: 'x', category: 'identifier', editable: true },
  { id: 'id_err', label: 'Erro', category: 'identifier', editable: true },
  { id: 'id_parent', label: 'Pai', category: 'identifier', editable: true },
  { id: 'id_a', label: 'a', category: 'identifier', editable: true },
  { id: 'id_b', label: 'b', category: 'identifier', editable: true },
  { id: 'id_f', label: 'f', category: 'identifier', editable: true },
  { id: 'id_type', label: 'tipo', category: 'identifier', editable: true },
  // Literals
  { id: 'val_str', label: '"texto"', category: 'literal', editable: true },
  { id: 'prefix', label: 'f', category: 'literal' },
  { id: 'val', label: '0', category: 'literal', editable: true },
  { id: 'val_2', label: '2', category: 'literal', editable: true },
  { id: 'v1', label: '"val1"', category: 'literal', editable: true },
  { id: 'v2', label: '"val2"', category: 'literal', editable: true },
  { id: 'key', label: '"chave"', category: 'literal', editable: true },
];

export const TYPESCRIPT_TOKENS: SyntaxToken[] = [
  // Keywords
  { id: 'kw_let', label: 'let', category: 'keyword' },
  { id: 'kw_const', label: 'const', category: 'keyword' },
  { id: 'kw_func', label: 'function', category: 'keyword' },
  { id: 'kw_interface', label: 'interface', category: 'keyword' },
  { id: 'kw_enum', label: 'enum', category: 'keyword' },
  { id: 'kw_type', label: 'type', category: 'keyword' },
  { id: 'kw_priv', label: 'private', category: 'keyword' },
  { id: 'kw_ro', label: 'readonly', category: 'keyword' },
  { id: 'kw_any', label: 'any', category: 'keyword' },
  { id: 'kw_void', label: 'void', category: 'keyword' },
  { id: 'kw_as', label: 'as', category: 'keyword' },
  { id: 'kw_int', label: 'interface', category: 'keyword' },
  { id: 'kw_ext', label: 'extends', category: 'keyword' },
  { id: 'kw_ns', label: 'namespace', category: 'keyword' },
  { id: 'kw_ctor', label: 'constructor', category: 'keyword' },
  { id: 'kw_pub', label: 'public', category: 'keyword' },
  { id: 'kw_abs', label: 'abstract', category: 'keyword' },
  { id: 'kw_class', label: 'class', category: 'keyword' },
  // Types
  { id: 'kw_array', label: 'Array', category: 'type' },
  // Symbols
  { id: 'sym_colon', label: ':', category: 'symbol' },
  { id: 'sym_semicolon', label: ';', category: 'symbol' },
  { id: 'sym_open_brace', label: '{', category: 'symbol' },
  { id: 'sym_close_brace', label: '}', category: 'symbol' },
  { id: 'sym_open_paren', label: '(', category: 'symbol' },
  { id: 'sym_close_paren', label: ')', category: 'symbol' },
  { id: 'sym_open_bracket', label: '[', category: 'symbol' },
  { id: 'sym_close_bracket', label: ']', category: 'symbol' },
  { id: 'sym_lt', label: '<', category: 'symbol' },
  { id: 'sym_gt', label: '>', category: 'symbol' },
  { id: 'sym_comma', label: ',', category: 'symbol' },
  { id: 'sym_dot', label: '.', category: 'symbol' },
  // Operators
  { id: 'op_assign', label: '=', category: 'operator' },
  { id: 'op_opt', label: '?', category: 'operator' },
  { id: 'op_union', label: '|', category: 'operator' },
  { id: 'op_and', label: '&', category: 'operator' },
  { id: 'op_arrow', label: '=>', category: 'operator' },
  // Identifiers
  { id: 'id_name', label: 'nome', category: 'identifier', editable: true },
  { id: 'id_var', label: 'variavel', category: 'identifier', editable: true },
  { id: 'id_prop', label: 'propriedade', category: 'identifier', editable: true },
  { id: 'id_p', label: 'parametro', category: 'identifier', editable: true },
  { id: 'id_attr', label: 'atributo', category: 'identifier', editable: true },
  { id: 'id_obj', label: 'objeto', category: 'identifier', editable: true },
  { id: 'id_child', label: 'Filho', category: 'identifier', editable: true },
  { id: 'id_parent', label: 'Pai', category: 'identifier', editable: true },
  { id: 'id_t', label: 'T', category: 'identifier', editable: true },
  { id: 'id_res', label: 'resultado', category: 'identifier', editable: true },
  { id: 'id_1', label: 'iden1', category: 'identifier', editable: true },
  { id: 'id_2', label: 'iden2', category: 'identifier', editable: true },
  { id: 'id_p1', label: 'p1', category: 'identifier', editable: true },
  { id: 'id_p2', label: 'p2', category: 'identifier', editable: true },
  { id: 't1', label: 't1', category: 'identifier', editable: true },
  { id: 't2', label: 't2', category: 'identifier', editable: true },
  // Literals
  { id: 'val_str', label: '"texto"', category: 'literal', editable: true },
  { id: 'val_num', label: '0', category: 'literal', editable: true },
  { id: 'v1', label: '"val1"', category: 'literal', editable: true },
  { id: 'v2', label: '"val2"', category: 'literal', editable: true },
];


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

export const SQL_TOKENS: SyntaxToken[] = [
  {
    id: "kw_select",
    label: "SELECT",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_star",
    label: "*",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_from",
    label: "FROM",
    category: "keyword",
    editable: false
  },
  {
    id: "id_table",
    label: "clientes",
    category: "identifier",
    editable: true
  },
  {
    id: "id_column",
    label: "nome",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_where",
    label: "WHERE",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_equal",
    label: "=",
    category: "symbol",
    editable: false
  },
  {
    id: "val_string",
    label: "'Eletrônicos'",
    category: "literal",
    editable: true
  },
  {
    id: "kw_order",
    label: "ORDER BY",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_asc",
    label: "ASC",
    category: "keyword",
    editable: false
  },
  {
    id: "fn_count",
    label: "COUNT",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_open_paren",
    label: "(",
    category: "symbol",
    editable: false
  },
  {
    id: "sym_close_paren",
    label: ")",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_distinct",
    label: "DISTINCT",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_limit",
    label: "LIMIT",
    category: "keyword",
    editable: false
  },
  {
    id: "val_number",
    label: "5",
    category: "literal",
    editable: true
  },
  {
    id: "sym_gt",
    label: ">",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_insert",
    label: "INSERT INTO",
    category: "keyword",
    editable: false
  },
  {
    id: "id_col1",
    label: "nome",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_comma",
    label: ",",
    category: "symbol",
    editable: false
  },
  {
    id: "id_col2",
    label: "cidade",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_values",
    label: "VALUES",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_open_paren2",
    label: "(",
    category: "symbol",
    editable: false
  },
  {
    id: "val_name",
    label: "'João Silva'",
    category: "literal",
    editable: true
  },
  {
    id: "sym_comma2",
    label: ",",
    category: "symbol",
    editable: false
  },
  {
    id: "val_city",
    label: "'São Paulo'",
    category: "literal",
    editable: true
  },
  {
    id: "sym_close_paren2",
    label: ")",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_delete",
    label: "DELETE FROM",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_and",
    label: "AND",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_group",
    label: "GROUP BY",
    category: "keyword",
    editable: false
  },
  {
    id: "id_table1",
    label: "clientes",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_join",
    label: "INNER JOIN",
    category: "keyword",
    editable: false
  },
  {
    id: "id_table2",
    label: "pedidos",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_on",
    label: "ON",
    category: "keyword",
    editable: false
  },
  {
    id: "id_fk1",
    label: "clientes.cliente_id",
    category: "identifier",
    editable: true
  },
  {
    id: "id_fk2",
    label: "pedidos.cliente_id",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_having",
    label: "HAVING",
    category: "keyword",
    editable: false
  },
  {
    id: "fn_count2",
    label: "COUNT",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_star2",
    label: "*",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_update",
    label: "UPDATE",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_set",
    label: "SET",
    category: "keyword",
    editable: false
  },
  {
    id: "id_pk",
    label: "id",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_equal2",
    label: "=",
    category: "symbol",
    editable: false
  },
  {
    id: "val_id",
    label: "10",
    category: "literal",
    editable: true
  },
  {
    id: "kw_like",
    label: "LIKE",
    category: "keyword",
    editable: false
  },
  {
    id: "val_pattern",
    label: "'A%'",
    category: "literal",
    editable: true
  },
  {
    id: "kw_between",
    label: "BETWEEN",
    category: "keyword",
    editable: false
  },
  {
    id: "val_min",
    label: "100",
    category: "literal",
    editable: true
  },
  {
    id: "val_max",
    label: "500",
    category: "literal",
    editable: true
  },
  {
    id: "kw_as",
    label: "AS",
    category: "keyword",
    editable: false
  },
  {
    id: "id_alias",
    label: "remuneracao",
    category: "identifier",
    editable: true
  },
  {
    id: "fn_sum",
    label: "SUM",
    category: "identifier",
    editable: true
  },
  {
    id: "id_col3",
    label: "departamento",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_select2",
    label: "SELECT",
    category: "keyword",
    editable: false
  },
  {
    id: "fn_avg",
    label: "AVG",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_from2",
    label: "FROM",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_case",
    label: "CASE",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_when1",
    label: "WHEN",
    category: "keyword",
    editable: false
  },
  {
    id: "val_num1",
    label: "8000",
    category: "literal",
    editable: true
  },
  {
    id: "kw_then1",
    label: "THEN",
    category: "keyword",
    editable: false
  },
  {
    id: "val_alto",
    label: "'Alto'",
    category: "literal",
    editable: true
  },
  {
    id: "kw_when2",
    label: "WHEN",
    category: "keyword",
    editable: false
  },
  {
    id: "id_col4",
    label: "salario",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_then2",
    label: "THEN",
    category: "keyword",
    editable: false
  },
  {
    id: "val_medio",
    label: "'Médio'",
    category: "literal",
    editable: true
  },
  {
    id: "kw_else",
    label: "ELSE",
    category: "keyword",
    editable: false
  },
  {
    id: "val_baixo",
    label: "'Baixo'",
    category: "literal",
    editable: true
  },
  {
    id: "kw_end",
    label: "END",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_comma1",
    label: ",",
    category: "symbol",
    editable: false
  },
  {
    id: "fn_row",
    label: "ROW_NUMBER",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_over",
    label: "OVER",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_partition",
    label: "PARTITION BY",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_desc",
    label: "DESC",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_with",
    label: "WITH",
    category: "keyword",
    editable: false
  },
  {
    id: "id_cte",
    label: "top_clientes",
    category: "identifier",
    editable: true
  },
  {
    id: "id_cte2",
    label: "top_clientes",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_as1",
    label: "AS",
    category: "keyword",
    editable: false
  },
  {
    id: "id_alias1",
    label: "funcionario",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_as2",
    label: "AS",
    category: "keyword",
    editable: false
  },
  {
    id: "id_alias2",
    label: "gerente",
    category: "identifier",
    editable: true
  },
  {
    id: "id_alias3",
    label: "f",
    category: "identifier",
    editable: true
  },
  {
    id: "id_alias4",
    label: "g",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_exists",
    label: "EXISTS",
    category: "keyword",
    editable: false
  },
  {
    id: "val_one",
    label: "1",
    category: "literal",
    editable: true
  },
  {
    id: "kw_where2",
    label: "WHERE",
    category: "keyword",
    editable: false
  },
  {
    id: "fn_sum1",
    label: "SUM",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_open1",
    label: "(",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_case1",
    label: "CASE",
    category: "keyword",
    editable: false
  },
  {
    id: "id_col_mes1",
    label: "mes",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_eq1",
    label: "=",
    category: "symbol",
    editable: false
  },
  {
    id: "val_jan",
    label: "'Janeiro'",
    category: "literal",
    editable: true
  },
  {
    id: "id_col_val1",
    label: "valor",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_else1",
    label: "ELSE",
    category: "keyword",
    editable: false
  },
  {
    id: "val_zero1",
    label: "0",
    category: "literal",
    editable: true
  },
  {
    id: "kw_end1",
    label: "END",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_close1",
    label: ")",
    category: "symbol",
    editable: false
  },
  {
    id: "fn_sum2",
    label: "SUM",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_open2",
    label: "(",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_case2",
    label: "CASE",
    category: "keyword",
    editable: false
  },
  {
    id: "id_col_mes2",
    label: "mes",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_eq2",
    label: "=",
    category: "symbol",
    editable: false
  },
  {
    id: "val_fev",
    label: "'Fevereiro'",
    category: "literal",
    editable: true
  },
  {
    id: "id_col_val2",
    label: "valor",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_else2",
    label: "ELSE",
    category: "keyword",
    editable: false
  },
  {
    id: "val_zero2",
    label: "0",
    category: "literal",
    editable: true
  },
  {
    id: "kw_end2",
    label: "END",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_close2",
    label: ")",
    category: "symbol",
    editable: false
  },
  {
    id: "fn_sum3",
    label: "SUM",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_open3",
    label: "(",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_case3",
    label: "CASE",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_when3",
    label: "WHEN",
    category: "keyword",
    editable: false
  },
  {
    id: "id_col_mes3",
    label: "mes",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_eq3",
    label: "=",
    category: "symbol",
    editable: false
  },
  {
    id: "val_mar",
    label: "'Março'",
    category: "literal",
    editable: true
  },
  {
    id: "kw_then3",
    label: "THEN",
    category: "keyword",
    editable: false
  },
  {
    id: "id_col_val3",
    label: "valor",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_else3",
    label: "ELSE",
    category: "keyword",
    editable: false
  },
  {
    id: "val_zero3",
    label: "0",
    category: "literal",
    editable: true
  },
  {
    id: "kw_end3",
    label: "END",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_close3",
    label: ")",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_as3",
    label: "AS",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_select1",
    label: "SELECT",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_from1",
    label: "FROM",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_eq",
    label: "=",
    category: "symbol",
    editable: false
  },
  {
    id: "kw_union",
    label: "UNION ALL",
    category: "keyword",
    editable: false
  },
  {
    id: "sym_comma3",
    label: ",",
    category: "symbol",
    editable: false
  },
  {
    id: "id_col5",
    label: "f.nome",
    category: "identifier",
    editable: true
  },
  {
    id: "sym_comma4",
    label: ",",
    category: "symbol",
    editable: false
  },
  {
    id: "id_col6",
    label: "f.gerente_id",
    category: "identifier",
    editable: true
  },
  {
    id: "kw_select3",
    label: "SELECT",
    category: "keyword",
    editable: false
  },
  {
    id: "kw_from3",
    label: "FROM",
    category: "keyword",
    editable: false
  },
  {
    id: "id_cte3",
    label: "hierarquia",
    category: "identifier",
    editable: true
  }
];

export const LANGUAGE_TOKENS: Record<Language, SyntaxToken[]> = {
  javascript: JAVASCRIPT_TOKENS,
  java: JAVA_TOKENS,
  csharp: CSHARP_TOKENS,
  python: PYTHON_TOKENS,
  typescript: TYPESCRIPT_TOKENS,
  sql: SQL_TOKENS,
};

export const LANGUAGES: LanguageInfo[] = [
  { id: 'javascript', label: 'JavaScript', color: '#854d0e', accent: '#FDE047', icon: 'language-javascript' },
  { id: 'python', label: 'Python', color: '#1e3a8a', accent: '#60a5fa', icon: 'language-python' },
  { id: 'typescript', label: 'TypeScript', color: '#1e3a8a', accent: '#3b82f6', icon: 'language-typescript' },
  { id: 'java', label: 'Java', color: '#7c2d12', accent: '#FB923C', icon: 'language-java' },
  { id: 'csharp', label: 'C#', color: '#312e81', accent: '#818CF8', icon: 'language-csharp' },
  { id: 'sql', label: 'SQL', color: '#115e59', accent: '#2dd4bf', icon: 'database-search' },
];
