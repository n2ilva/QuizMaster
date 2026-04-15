import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import {
  TOKEN_CATEGORY_COLORS,
  type LanguageInfo,
} from '../coding-practice.constants';
import { type Difficulty, type Exercise, type ExerciseType, type PlacedToken, type SyntaxToken } from '../coding-practice.types';
import { PuzzlePiece } from './puzzle-piece';

// ─────────────────────────────────────────────
// Config tables
// ─────────────────────────────────────────────
export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  iniciante:       { label: 'Iniciante',      color: '#22C55E', bg: '#052E16' },
  'intermediário': { label: 'Intermediário',  color: '#F59E0B', bg: '#1C1100' },
  avançado:        { label: 'Avançado',       color: '#EF4444', bg: '#2D0000' },
};

export const EXERCISE_TYPE_ICONS: Record<ExerciseType, string> = {
  Classe:      'account-balance',
  Função:      'functions',
  Array:       'data-object',
  Objeto:      'data-object',
  Método:      'auto-fix-high',
  Namespace:   'folder',
  Interface:   'integration-instructions',
  Loop:        'loop',
  Condicional: 'alt-route',
};

export const CATEGORY_COLORS: Record<string, string> = {
  Classe: '#3B82F6',
  Função: '#8B5CF6',
  Variável: '#F59E0B',
  Método: '#10B981',
  Namespace: '#EC4899',
  Interface: '#06B6D4',
  Loop: '#EF4444',
  Condicional: '#F97316',
};

// ─────────────────────────────────────────────
// Language Selector
// ─────────────────────────────────────────────
type LanguageSelectorProps = {
  languages: LanguageInfo[];
  selected: LanguageInfo;
  onSelect: (lang: LanguageInfo) => void;
};

function LanguageItem({ lang, active, onSelect }: { lang: LanguageInfo; active: boolean; onSelect: (l: LanguageInfo) => void }) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const isHovered = hovered || pressed;

  return (
    <Pressable
      onPress={() => onSelect(lang)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        borderStyle: 'solid',
        borderWidth: 1.5,
        borderColor: active ? lang.accent : isHovered ? '#4B5563' : '#2D3139',
        backgroundColor: isHovered && !active ? '#1A1D21' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <MaterialCommunityIcons
        name={lang.icon as any}
        size={24}
        color={active ? lang.accent : isHovered ? '#ECEDEE' : '#9BA1A6'}
        style={{ marginBottom: 2 }}
      />
      <Text
        style={{
          color: active ? lang.accent : isHovered ? '#ECEDEE' : '#4B5563',
          fontSize: 11,
          fontWeight: active ? '700' : '500',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {lang.label}
      </Text>
    </Pressable>
  );
}

export function LanguageSelector({ languages, selected, onSelect }: LanguageSelectorProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
      {languages.map((lang) => (
        <LanguageItem key={lang.id} lang={lang} active={lang.id === selected.id} onSelect={onSelect} />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// Category Grid Card
// ─────────────────────────────────────────────
type CategoryGridCardProps = {
  categoryName: string;
  count: number;
  onPress: () => void;
};

export function CategoryGridCard({ categoryName, count, onPress }: CategoryGridCardProps) {
  const iconName = EXERCISE_TYPE_ICONS[categoryName as ExerciseType] ?? 'extension';
  const colorTheme = CATEGORY_COLORS[categoryName] ?? '#3B82F6';
  
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const isHovered = hovered || pressed;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        flexBasis: '47%',
        flexGrow: 1,
        backgroundColor: '#111316',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: isHovered ? colorTheme : colorTheme + '30',
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        position: 'relative',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: colorTheme + '20',
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colorTheme + '30',
        }}
      >
        <Text style={{ color: colorTheme, fontSize: 10, fontWeight: '800' }}>{count}</Text>
      </View>

      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: isHovered ? colorTheme + '20' : colorTheme + '10', alignItems: 'center', justifyContent: 'center' }}>
        <MaterialIcons name={iconName as any} size={24} color={colorTheme} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: isHovered ? '#FFFFFF' : '#ECEDEE', fontSize: 13, fontWeight: '700' }}>{categoryName}</Text>
      </View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────
// Exercise List Card
// ─────────────────────────────────────────────
type ExerciseListCardProps = {
  exercise: Exercise;
  language: LanguageInfo;
  onPress: () => void;
};

export function ExerciseListCard({ exercise, language, onPress }: ExerciseListCardProps) {
  const diff = DIFFICULTY_CONFIG[exercise.difficulty];
  const typeIcon = EXERCISE_TYPE_ICONS[exercise.exerciseType] ?? 'extension';
  
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const isHovered = hovered || pressed;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: isHovered ? '#1A1D21' : '#111316',
        borderRadius: 14,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: isHovered ? diff.color + '66' : '#1E2328',
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: `${language.accent}18`,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <MaterialCommunityIcons name={language.icon as any} size={22} color={language.accent} />
      </View>

      <View style={{ flex: 1, paddingRight: 8, gap: 4 }}>
        <Text style={{ color: '#ECEDEE', fontSize: 14, fontWeight: '700' }}>{exercise.title}</Text>
        <Text style={{ color: '#6B7280', fontSize: 12 }} numberOfLines={2}>
          {exercise.description}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center' }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 20,
              backgroundColor: diff.bg,
              borderWidth: 1,
              borderColor: diff.color + '55',
            }}
          >
            <Text style={{ color: diff.color, fontSize: 10, fontWeight: '700' }}>
              {diff.label}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 20,
              backgroundColor: '#1A1D21',
              borderWidth: 1,
              borderColor: '#2D3139',
            }}
          >
            <MaterialIcons name={typeIcon as any} size={10} color="#6B7280" />
            <Text style={{ color: '#6B7280', fontSize: 10, fontWeight: '600' }}>
              {exercise.exerciseType}
            </Text>
          </View>
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={20} color="#374151" />
    </Pressable>
  );
}

// ─────────────────────────────────────────────
// Exercise Question Card (Duolingo top section)
// ─────────────────────────────────────────────
type QuestionCardProps = {
  exercise: Exercise;
  language: LanguageInfo;
  onBack: () => void;
  hintIndex: number;
  onShowHint: () => void;
  onHideHints?: () => void;
};

export function QuestionCard({ exercise, language, onBack, hintIndex, onShowHint, onHideHints }: QuestionCardProps) {
  const diff = DIFFICULTY_CONFIG[exercise.difficulty];
  const maxHints = exercise.hints?.length ?? 0;

  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
      {/* Top bar: back + language badge */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={12}
          activeOpacity={0.6}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#1A1D21',
            alignItems: 'center',
            justifyContent: 'center',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#2D3139',
          }}
        >
          <MaterialIcons name="close" size={18} color="#9BA1A6" />
        </TouchableOpacity>

        {/* Progress-like bar */}
        <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: '#1A1D21', overflow: 'hidden' }}>
          <View style={{ height: '100%', width: '0%', backgroundColor: language.accent, borderRadius: 4 }} />
        </View>

        {/* Hint button */}
        <TouchableOpacity
          onPress={onShowHint}
          disabled={maxHints === 0 || hintIndex >= maxHints}
          hitSlop={8}
          activeOpacity={0.6}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#1C1600',
            alignItems: 'center',
            justifyContent: 'center',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#44300A',
            opacity: maxHints === 0 || hintIndex >= maxHints ? 0.3 : 1,
          }}
        >
          <MaterialIcons name="lightbulb-outline" size={18} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      {/* Question text */}
      <Text style={{ color: '#ECEDEE', fontSize: 20, fontWeight: '700', lineHeight: 28, marginBottom: 6 }}>
        Monte o código:
      </Text>
      <Text style={{ color: '#9BA1A6', fontSize: 15, lineHeight: 22, marginBottom: 10 }}>
        {exercise.description}
      </Text>

      {/* Meta badges */}
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 }}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 20,
            backgroundColor: diff.bg,
            borderWidth: 1,
            borderColor: diff.color + '44',
          }}
        >
          <Text style={{ color: diff.color, fontSize: 10, fontWeight: '700' }}>{diff.label}</Text>
        </View>
        <Text style={{ color: '#374151', fontSize: 11 }}>•</Text>
        <Text style={{ color: '#4B5563', fontSize: 11, fontWeight: '600' }}>{language.label}</Text>
      </View>

      {/* Hints Dropdown */}
      {hintIndex > 0 && exercise.hints && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#1C1600',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#F59E0B44',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#292000',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#F59E0B22',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
              <Text style={{ color: '#FCD34D', fontWeight: 'bold', fontSize: 13 }}>
                {hintIndex === 1 ? '1 Dica desbloqueada' : `${hintIndex} Dicas desbloqueadas`}
              </Text>
            </View>
            <TouchableOpacity onPress={onHideHints} hitSlop={12}>
              <MaterialIcons name="close" size={18} color="#F59E0B" />
            </TouchableOpacity>
          </View>

          {/* Hint content */}
          <View style={{ padding: 12, gap: 10 }}>
            {exercise.hints.slice(0, hintIndex).map((hint, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={{ color: '#F59E0B', fontSize: 13, fontWeight: 'bold' }}>{i + 1}.</Text>
                <Text style={{ color: '#FCD34D', fontSize: 13, lineHeight: 19, flex: 1 }}>{hint}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Answer Area — where placed tokens go
// ─────────────────────────────────────────────
type AnswerAreaProps = {
  placed: PlacedToken[];
  allTokens: SyntaxToken[];
  onRemove: (instanceId: string) => void;
  onRename: (instanceId: string, newLabel: string) => void;
  onClear: () => void;
  isCorrect: boolean | null;
  expectedCount: number;
};

export function AnswerArea({
  placed,
  allTokens,
  onRemove,
  onRename,
  onClear,
  isCorrect,
  expectedCount,
}: AnswerAreaProps) {
  const tokenMap = new Map(allTokens.map((t) => [t.id, t]));
  tokenMap.set('sym_newline', { id: 'sym_newline', label: '↵', category: 'symbol' });
  const displayPlacedCount = placed.filter(p => p.tokenId !== 'sym_newline').length;

  const borderColor =
    isCorrect === true ? '#22C55E' : isCorrect === false ? '#EF4444' : '#2D3139';
  const bgColor =
    isCorrect === true ? '#052E1605' : isCorrect === false ? '#2D000005' : 'transparent';

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
      {/* Separator line */}
      <View
        style={{
          borderTopWidth: 2,
          borderBottomWidth: 2,
          borderColor,
          borderStyle: 'dashed',
          borderRadius: 16,
          backgroundColor: bgColor,
          minHeight: 80,
          padding: 12,
        }}
      >
        {/* Clear button */}
        {placed.length > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 }}>
            <TouchableOpacity
              onPress={onClear}
              hitSlop={8}
              activeOpacity={0.6}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: '#1A1D21',
              }}
            >
              <MaterialIcons name="backspace" size={13} color="#4B5563" />
              <Text style={{ color: '#4B5563', fontSize: 10, fontWeight: '600' }}>Limpar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tokens or placeholder */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            minHeight: 48,
            alignContent: 'flex-start',
          }}
        >
          {placed.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
              <Text style={{ color: '#2D3139', fontSize: 13 }}>
                Toque nas peças abaixo para montar
              </Text>
            </View>
          ) : (
            placed.map((p) => {
              const token = tokenMap.get(p.tokenId);
              if (!token) return null;

              if (token.id === 'sym_newline') {
                return (
                  <View key={p.instanceId} style={{ width: '100%', flexDirection: 'row', paddingVertical: 2 }}>
                    <TouchableOpacity
                      onPress={() => onRemove(p.instanceId)}
                      style={{ paddingHorizontal: 6, paddingVertical: 4, backgroundColor: '#1A1D21', borderRadius: 6 }}
                    >
                      <MaterialIcons name="keyboard-return" size={12} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                );
              }

              return (
                <PuzzlePiece
                  key={p.instanceId}
                  token={token}
                  customLabel={p.customLabel}
                  variant="answer"
                  onPress={() => onRemove(p.instanceId)}
                  onRename={(newLabel) => onRename(p.instanceId, newLabel)}
                />
              );
            })
          )}
        </View>

        {/* Token count indicator */}
        {placed.length > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
            <Text style={{ color: '#374151', fontSize: 10 }}>
              {displayPlacedCount} / {expectedCount} peças
            </Text>
          </View>
        )}
      </View>

      {/* Feedback messages */}
      {isCorrect === true && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            backgroundColor: '#052E16',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: '#22C55E44',
          }}
        >
          <MaterialIcons name="check-circle" size={22} color="#22C55E" />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#22C55E', fontSize: 15, fontWeight: '700' }}>Correto!</Text>
            <Text style={{ color: '#86EFAC', fontSize: 12 }}>Excelente trabalho! 🎉</Text>
          </View>
        </View>
      )}
      {isCorrect === false && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            backgroundColor: '#2D0000',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: '#EF444444',
          }}
        >
          <MaterialIcons name="error-outline" size={22} color="#EF4444" />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#EF4444', fontSize: 15, fontWeight: '700' }}>Não está certo</Text>
            <Text style={{ color: '#FCA5A5', fontSize: 12 }}>Tente reorganizar as peças.</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Token Keyboard — mobile keyboard style
// ─────────────────────────────────────────────

const SYMBOL_CATEGORIES = new Set(['symbol', 'operator']);

type TokenKeyboardProps = {
  pool: PlacedToken[];
  allTokens: SyntaxToken[];
  onAddToken: (instanceId: string) => void;
  onAddNewline: () => void;
};

export function TokenKeyboard({ pool, allTokens, onAddToken, onAddNewline }: TokenKeyboardProps) {
  const tokenMap = new Map(allTokens.map((t) => [t.id, t]));

  // Split into symbols (first row) and words (remaining rows) using the instances in the pool
  const symbolInstances = pool
    .filter((p) => {
      const t = tokenMap.get(p.tokenId);
      return t && SYMBOL_CATEGORIES.has(t.category);
    })
    .sort((a, b) => {
      const idxA = allTokens.findIndex((t) => t.id === a.tokenId);
      const idxB = allTokens.findIndex((t) => t.id === b.tokenId);
      return idxA - idxB;
    });

  const wordInstances = pool
    .filter((p) => {
      const t = tokenMap.get(p.tokenId);
      return t && !SYMBOL_CATEGORIES.has(t.category);
    })
    .sort((a, b) => {
      const la = tokenMap.get(a.tokenId)?.label.toLowerCase() || '';
      const lb = tokenMap.get(b.tokenId)?.label.toLowerCase() || '';
      return la.localeCompare(lb);
    });

  return (
    <View
      style={{
        backgroundColor: '#111316',
        borderTopWidth: 1,
        borderTopColor: '#1E2328',
        paddingTop: 10,
        paddingBottom: 6,
        paddingHorizontal: 4,
      }}
    >
      {/* Row 1: Symbols */}
      {symbolInstances.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 6,
            paddingHorizontal: 6,
            marginBottom: 8,
          }}
        >
          {symbolInstances.map((p) => {
            const token = tokenMap.get(p.tokenId);
            if (!token) return null;
            return (
              <PuzzlePiece
                key={p.instanceId}
                token={token}
                variant="key"
                onPress={() => onAddToken(p.instanceId)}
              />
            );
          })}
        </View>
      )}

      {/* Row 2+: Words in alphabetical order */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 6,
          paddingHorizontal: 6,
        }}
      >
        {wordInstances.map((p) => {
          const token = tokenMap.get(p.tokenId);
          if (!token) return null;
          return (
            <PuzzlePiece
              key={p.instanceId}
              token={token}
              variant="key"
              onPress={() => onAddToken(p.instanceId)}
            />
          );
        })}
      </View>

      {/* Row 3: Action keys (Enter) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          marginTop: 10,
          marginBottom: 4,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAddNewline}
          style={{
            backgroundColor: '#3B82F6',
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 12,
            borderBottomWidth: 3,
            borderColor: '#2563EB',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14, textTransform: 'uppercase' }}>
            Enter
          </Text>
          <MaterialIcons name="keyboard-return" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

// ... (já temos React no topo, mas eu uso lá direto como React.useEffect)

// ─────────────────────────────────────────────
// Validate Button
// ─────────────────────────────────────────────
type ValidateButtonProps = {
  onPress: () => void;
  disabled: boolean;
  isCorrect: boolean | null;
};

export function ValidateButton({ onPress, disabled, isCorrect }: ValidateButtonProps) {
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isCorrect === false) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [isCorrect, shakeAnim]);

  const bgColor = disabled
    ? '#1A1D21'
    : isCorrect === true
      ? '#166534'
      : isCorrect === false
        ? '#EF4444' /* Vermelho Erro */
        : '#58CC02';

  const borderBotColor = disabled
    ? 'transparent'
    : isCorrect === true
      ? '#14532D'
      : isCorrect === false
        ? '#B91C1C' 
        : '#46A302';

  const textColor = disabled ? '#374151' : '#FFFFFF';

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={{
          marginHorizontal: 20,
          marginBottom: 8,
          paddingVertical: 16,
          borderRadius: 16,
          borderStyle: 'solid',
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.7 : 1,
          borderBottomWidth: disabled ? 0 : 4,
          borderColor: borderBotColor,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontWeight: '800',
            fontSize: 16,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {isCorrect === true ? 'Continuar' : isCorrect === false ? 'Incorreto' : 'Verificar'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
