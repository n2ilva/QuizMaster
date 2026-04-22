import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Animated, Modal, Pressable, Text, TouchableOpacity, View, useColorScheme, useWindowDimensions, ScrollView } from 'react-native';
import { DraxView } from 'react-native-drax';

import {
  TOKEN_CATEGORY_COLORS,
  type LanguageInfo,
} from '../coding-practice.constants';
import { type Difficulty, type Exercise, type ExerciseType, type PlacedToken, type SyntaxToken } from '../coding-practice.types';
import { type ExerciseProgress } from '../coding-practice.store';
import { PuzzlePiece } from './puzzle-piece';
import { GlossaryText } from '@/components/glossary-text';

// ─────────────────────────────────────────────
// Config tables
// ─────────────────────────────────────────────
export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  iniciante:       { label: 'Iniciante',      color: '#22C55E', bg: '#052E16' },
  'intermediário': { label: 'Intermediário',  color: '#F59E0B', bg: '#1C1100' },
  avançado:        { label: 'Avançado',       color: '#EF4444', bg: '#2D0000' },
};

export const EXERCISE_TYPE_ICONS: Record<string, string> = {
  Classe:            'account-balance',
  Função:            'functions',
  Array:             'data-object',
  Objeto:            'data-object',
  Método:            'auto-fix-high',
  Namespace:         'folder',
  Interface:         'integration-instructions',
  Loop:              'loop',
  Condicional:       'alt-route',
  // Java / C# types
  Sintaxe:           'code',
  Variáveis:         'text-fields',
  'Controle de Fluxo': 'alt-route',
  Arrays:            'view-list',
  Classes:           'account-balance',
  Métodos:           'functions',
  POO:               'category',
  Collections:       'list-alt',
  Exceções:          'error-outline',
  Strings:           'text-format',
  Operadores:        'calculate',
  Estrutura:         'folder-open',
  LINQ:              'filter-list',
  Assincronismo:     'sync',
  Tipos:             'label',
  Recursos:          'memory',
  // Python / TypeScript specific
  Listas:            'list',
  Dicionários:       'book',
  Módulos:           'extension',
  Tipagem:           'label',
  Arquivos:          'file-present',
  Generics:          'api',
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
  // Java / C# types
  Sintaxe: '#6366F1',
  Variáveis: '#F59E0B',
  'Controle de Fluxo': '#F97316',
  Arrays: '#14B8A6',
  Classes: '#3B82F6',
  Métodos: '#8B5CF6',
  POO: '#A855F7',
  Collections: '#06B6D4',
  Exceções: '#EF4444',
  Strings: '#84CC16',
  Operadores: '#F472B6',
  Estrutura: '#EC4899',
  LINQ: '#22D3EE',
  Assincronismo: '#818CF8',
  Tipos: '#FB923C',
  Recursos: '#34D399',
  // Python / TypeScript specific
  Listas: '#10B981',
  Dicionários: '#F59E0B',
  Módulos: '#8B5CF6',
  Tipagem: '#6366F1',
  Arquivos: '#14B8A6',
  Generics: '#F472B6',
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
  const { width } = useWindowDimensions();
  const showText = width >= 640;

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
        size={showText ? 24 : 28}
        color={active ? lang.accent : isHovered ? '#ECEDEE' : '#9BA1A6'}
        style={{ marginBottom: showText ? 2 : 0 }}
      />
      {showText && (
        <Text
          style={{
            color: active ? lang.accent : isHovered ? '#ECEDEE' : '#4B5563',
            fontSize: 11,
            fontWeight: active ? '800' : '600',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {lang.label}
        </Text>
      )}
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
  completedCount?: number;
  onPress: () => void;
};

export function CategoryGridCard({ categoryName, count, completedCount = 0, onPress }: CategoryGridCardProps) {
  const iconName = EXERCISE_TYPE_ICONS[categoryName as ExerciseType] ?? 'extension';
  const colorTheme = CATEGORY_COLORS[categoryName] ?? '#3B82F6';
  
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const isHovered = hovered || pressed;
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  
  const bg = isDark ? '#1C1F24' : '#FFFFFF';
  const borderStatic = isDark ? `${colorTheme}20` : `${colorTheme}15`;
  const borderHover = isDark ? `${colorTheme}60` : `${colorTheme}40`;
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        flexBasis: isDesktop ? '31%' : '47%',
        flexGrow: 1,
        backgroundColor: bg,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: isHovered ? borderHover : borderStatic,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        position: 'relative',
        shadowColor: colorTheme,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isHovered ? 0.15 : 0.05,
        shadowRadius: 12,
        elevation: isHovered ? 4 : 2,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: isDark ? `${colorTheme}15` : `${colorTheme}10`,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isDark ? `${colorTheme}30` : `${colorTheme}20`,
        }}
      >
        <Text style={{ color: colorTheme, fontSize: 11, fontWeight: '800' }}>{completedCount}/{count}</Text>
      </View>

      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: isDark ? `${colorTheme}15` : `${colorTheme}10`, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isDark ? `${colorTheme}30` : `${colorTheme}20` }}>
        <MaterialIcons name={iconName as any} size={24} color={colorTheme} />
      </View>
      <View style={{ alignItems: 'center', paddingHorizontal: 4 }}>
        <Text style={{ color: textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: -0.3, textAlign: 'center' }}>{categoryName}</Text>
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
  progress?: ExerciseProgress;
};

export function ExerciseListCard({ exercise, language, onPress, progress }: ExerciseListCardProps) {
  const diff = DIFFICULTY_CONFIG[exercise.difficulty];
  const typeIcon = EXERCISE_TYPE_ICONS[exercise.exerciseType] ?? 'extension';
  
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const isHovered = hovered || pressed;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isCompleted = progress?.completed;
  const bestTime = progress?.bestTime;
  const bestMoves = progress?.bestMoves;

  const bg = isDark ? (isHovered ? '#22252A' : '#1C1F24') : (isHovered ? '#F8FAFC' : '#FFFFFF');
  const borderStatic = isDark ? '#30363D' : '#E2E8F0';
  const borderHover = isDark ? `${diff.color}50` : `${diff.color}30`;
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';
  const textSecondary = isDark ? '#9BA1A6' : '#64748B';

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: bg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isCompleted ? '#10B98155' : isHovered ? borderHover : borderStatic,
        padding: 20,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        shadowColor: isCompleted ? '#10B981' : isHovered ? diff.color : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isHovered || isCompleted ? 0.08 : 0.03,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: isCompleted ? '#10B98118' : isDark ? `${language.accent}15` : `${language.accent}10`,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderWidth: 1,
          borderColor: isCompleted ? '#10B98140' : isDark ? `${language.accent}30` : `${language.accent}20`,
        }}
      >
        {isCompleted ? (
          <MaterialIcons name="workspace-premium" size={28} color="#10B981" />
        ) : (
          <MaterialCommunityIcons name={language.icon as any} size={28} color={language.accent} />
        )}
      </View>

      <View style={{ flex: 1, paddingRight: 8, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 }}>{exercise.title}</Text>
          {isCompleted && (
            <View style={{ backgroundColor: '#10B98122', padding: 2, borderRadius: 6 }}>
              <MaterialIcons name="done" size={12} color="#10B981" />
            </View>
          )}
        </View>
        <Text style={{ color: textSecondary, fontSize: 13, lineHeight: 20 }} numberOfLines={2}>
          {exercise.description}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 20,
              backgroundColor: diff.bg,
              borderWidth: 1,
              borderColor: diff.color + '55',
            }}
          >
            <Text style={{ color: diff.color, fontSize: 10, fontWeight: '800' }}>
              {diff.label}
            </Text>
          </View>
          
          {bestTime !== undefined && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 20,
                backgroundColor: '#064E3B44',
                borderWidth: 1,
                borderColor: '#10B98144',
              }}
            >
              <MaterialIcons name="timer" size={12} color="#10B981" />
              <Text style={{ color: '#10B981', fontSize: 10, fontWeight: '800' }}>
                {bestTime}s
              </Text>
            </View>
          )}

          {bestMoves !== undefined && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 20,
                backgroundColor: '#1E3A8A44',
                borderWidth: 1,
                borderColor: '#3B82F644',
              }}
            >
              <MaterialIcons name="touch-app" size={12} color="#3B82F6" />
              <Text style={{ color: '#3B82F6', fontSize: 10, fontWeight: '800' }}>
                {bestMoves} movs
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 20,
              backgroundColor: isDark ? '#1A1D21' : '#F1F5F9',
              borderWidth: 1,
              borderColor: isDark ? '#2D3139' : '#E2E8F0',
            }}
          >
            <MaterialIcons name={typeIcon as any} size={12} color={isDark ? "#6B7280" : "#475569"} />
            <Text style={{ color: isDark ? "#6B7280" : "#475569", fontSize: 10, fontWeight: '700' }}>
              {exercise.exerciseType}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
        <MaterialIcons name="arrow-forward" size={18} color={textPrimary} />
      </View>
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
  isHintsVisible?: boolean;
  onToggleHints?: (visible: boolean) => void;
  progressPercent?: number;
  liveTimer?: number;
};

export function QuestionCard({
  exercise,
  language,
  onBack,
  hintIndex,
  onShowHint,
  onHideHints,
  isHintsVisible = false,
  onToggleHints,
  progressPercent = 0,
  liveTimer = 0
}: QuestionCardProps) {
  const diff = DIFFICULTY_CONFIG[exercise.difficulty];
  const maxHints = exercise.hints?.length ?? 0;
  const remainingHints = Math.max(0, maxHints - hintIndex);
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 16, marginTop: 12 }}>
      {/* Top bar: back + progress + hints */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={12}
          activeOpacity={0.6}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isDark ? '#1A1D21' : '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: isDark ? '#2D3139' : '#E2E8F0',
          }}
        >
          <MaterialIcons name="close" size={18} color={isDark ? '#9BA1A6' : '#64748B'} />
        </TouchableOpacity>

        {/* Progress bar */}
        <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: isDark ? '#1A1D21' : '#E2E8F0', overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${clampedProgress}%`, backgroundColor: language.accent, borderRadius: 4 } as any} />
        </View>

        {/* Combined Hint Button and Already Unlocked Dropdown Trigger */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {/* Show the unlocked hints count / trigger View modal if we already have hints */}
          {hintIndex > 0 && (
            <TouchableOpacity
              onPress={() => onToggleHints?.(true)}
              hitSlop={8}
              activeOpacity={0.6}
              style={{
                height: 36,
                paddingHorizontal: 10,
                borderRadius: 18,
                backgroundColor: isDark ? '#1C1F24' : '#F8FAFC',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: '#F59E0B44',
              }}
            >
              <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
              <Text style={{ color: '#F59E0B', fontSize: 12, fontWeight: '800', marginLeft: 4 }}>
                {hintIndex}
              </Text>
            </TouchableOpacity>
          )}

          {/* Unlock New Hint Button */}
          <TouchableOpacity
            onPress={onShowHint}
            disabled={remainingHints === 0}
            hitSlop={8}
            activeOpacity={0.6}
            style={{
              height: 36,
              paddingHorizontal: 12,
              borderRadius: 18,
              backgroundColor: '#1C1600',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderStyle: 'solid',
              borderWidth: 1.5,
              borderColor: remainingHints > 0 ? '#F59E0B' : '#44300A',
              opacity: remainingHints === 0 ? 0.3 : 1,
            }}
          >
            <MaterialIcons name="lightbulb-outline" size={18} color="#F59E0B" />
            {remainingHints > 0 && (
              <Text style={{ color: '#F59E0B', fontSize: 13, fontWeight: '800', marginLeft: 4 }}>
                {remainingHints}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Question text */}
      <Text style={{ color: isDark ? '#ECEDEE' : '#11181C', fontSize: 20, fontWeight: '700', lineHeight: 28, marginBottom: 6 }}>
        Monte o código:
      </Text>
      <GlossaryText 
        text={exercise.description}
        style={{ color: isDark ? '#9BA1A6' : '#64748B', fontSize: 15, lineHeight: 22, marginBottom: 10 }}
      />

      {/* Meta badges + Timer */}
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
        <Text style={{ color: isDark ? '#374151' : '#CBD5E1', fontSize: 11 }}>•</Text>
        <Text style={{ color: isDark ? '#4B5563' : '#94A3B8', fontSize: 11, fontWeight: '600' }}>{language.label}</Text>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: isDark ? '#1A1D21' : '#F1F5F9', borderWidth: 1, borderColor: isDark ? '#2D3139' : '#E2E8F0' }}>
          <MaterialIcons name="timer" size={12} color={isDark ? '#6B7280' : '#94A3B8'} />
          <Text style={{ color: isDark ? '#6B7280' : '#94A3B8', fontSize: 10, fontWeight: '700', fontFamily: 'monospace' }}>
            {Math.floor(liveTimer / 60).toString().padStart(2, '0')}:{(liveTimer % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>

      {/* Hints Modal */}
      <Modal
        visible={isHintsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => onToggleHints?.(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onPress={() => onToggleHints?.(false)}
        >
          <Pressable
            style={{
              width: '100%',
              maxWidth: 400,
              backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
              borderRadius: 24,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: isDark ? '#30363D' : '#E2E8F0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 24,
            }}
            onPress={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: isDark ? '#252930' : '#F8FAFC',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#30363D' : '#E2E8F0',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F59E0B22', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
                </View>
                <Text style={{ color: isDark ? '#ECEDEE' : '#11181C', fontWeight: '800', fontSize: 16 }}>
                  Dicas do Exercício
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onToggleHints?.(false)}
                hitSlop={12}
                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isDark ? '#1A1D21' : '#E2E8F0', alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="close" size={18} color={isDark ? '#9BA1A6' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Hint content */}
            <ScrollView
              style={{ maxHeight: 400 }}
              contentContainerStyle={{ padding: 20, gap: 16 }}
            >
              {exercise.hints && exercise.hints.slice(0, hintIndex).map((hint, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    backgroundColor: isDark ? '#16191D' : '#F1F5F9',
                    padding: 14,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isDark ? '#2D3139' : '#E2E8F0',
                  }}
                >
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F59E0B22', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <Text style={{ color: '#F59E0B', fontSize: 12, fontWeight: '900' }}>{i + 1}</Text>
                  </View>
                  <Text style={{ color: isDark ? '#ECEDEE' : '#334155', fontSize: 15, lineHeight: 22, flex: 1, fontWeight: '500' }}>
                    {hint}
                  </Text>
                </View>
              ))}
              {hintIndex === 0 && (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <MaterialIcons name="lightbulb-outline" size={40} color={isDark ? '#2D3139' : '#CBD5E1'} />
                  <Text style={{ color: isDark ? '#4B5563' : '#94A3B8', textAlign: 'center', marginTop: 12 }}>
                    Nenhuma dica desbloqueada ainda.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: isDark ? '#30363D' : '#E2E8F0', alignItems: 'center' }}>
               {remainingHints > 0 ? (
                 <TouchableOpacity
                   onPress={onShowHint}
                   style={{
                     backgroundColor: '#F59E0B',
                     paddingHorizontal: 20,
                     paddingVertical: 12,
                     borderRadius: 14,
                     flexDirection: 'row',
                     alignItems: 'center',
                     gap: 8,
                     width: '100%',
                     justifyContent: 'center'
                   }}
                 >
                   <MaterialIcons name="add-comment" size={18} color="#FFFFFF" />
                   <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Desbloquear nova dica ({remainingHints} restantes)</Text>
                 </TouchableOpacity>
               ) : (
                 <Text style={{ color: isDark ? '#4B5563' : '#94A3B8', fontSize: 12, fontWeight: '600' }}>
                   Todas as dicas foram desbloqueadas.
                 </Text>
               )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  onAddToken: (instanceId: string) => void;
  onReorder: (fromInstanceId: string, toIndex: number) => void;
  onInsertAt: (instanceId: string, atIndex: number) => void;
  isCorrect: boolean | null;
  expectedCount: number;
  solution: string[];
};

export function AnswerArea({
  placed,
  allTokens,
  onRemove,
  onRename,
  onClear,
  onAddToken,
  onReorder,
  onInsertAt,
  isCorrect,
  expectedCount,
  solution = [],
}: AnswerAreaProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const tokenMap = React.useMemo(() => {
    const map = new Map(allTokens.map((t) => [t.id, t]));
    map.set('sym_newline', { id: 'sym_newline', label: '↵', category: 'symbol' });
    return map;
  }, [allTokens]);
  const displayPlacedCount = placed.filter(p => p.tokenId !== 'sym_newline').length;

  // Pre-compute correct position flags in O(N) instead of O(N²)
  const correctFlags = React.useMemo(() => {
    if (!solution || solution.length === 0) return [];
    let allCorrect = true;
    return placed.map((p, i) => {
      if (p.tokenId === 'sym_newline') return false;
      if (!allCorrect) return false;
      allCorrect = p.tokenId === solution[i];
      return allCorrect;
    });
  }, [placed, solution]);

  const borderColor = isCorrect === false ? '#EF4444' : (isDark ? '#2D3139' : '#E2E8F0');
  const bgColor = isCorrect === false ? (isDark ? '#2D000005' : '#FEF2F2') : 'transparent';

  // Handle drop on a specific index (reorder or insert)
  const handleDropOnIndex = React.useCallback((payload: string, targetIndex: number) => {
    if (payload.startsWith('ans_')) {
      const fromId = payload.replace('ans_', '');
      onReorder(fromId, targetIndex);
    } else if (payload.startsWith('kb_')) {
      const id = payload.replace('kb_', '');
      onInsertAt(id, targetIndex);
    }
  }, [onReorder, onInsertAt]);

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
      {/* Editor Container */}
      <View
        style={{
          borderWidth: 1.5,
          borderColor,
          borderRadius: 20,
          backgroundColor: '#0D0F12',
          minHeight: 120,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 15,
          elevation: 10,
        }}
      >
        {/* Window controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5F56' }} />
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFBD2E' }} />
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#27C93F' }} />
          <Text style={{ color: '#4B5563', fontSize: 11, fontWeight: '700', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 }}>puzzle.code</Text>
        </View>

        <DraxView
          style={{ flex: 1, minHeight: 60 }}
          receptive
          onReceiveDragDrop={(event) => {
            const payload = event.dragged.payload;
            if (payload && typeof payload === 'string') {
              if (payload.startsWith('kb_')) {
                const id = payload.replace('kb_', '');
                onAddToken(id);
              }
            }
          }}
          receivingStyle={{
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 2,
            borderRadius: 14,
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
                  backgroundColor: isDark ? '#1A1D21' : '#F1F5F9',
                }}
              >
                <MaterialIcons name="backspace" size={13} color={isDark ? '#4B5563' : '#94A3B8'} />
                <Text style={{ color: isDark ? '#4B5563' : '#94A3B8', fontSize: 10, fontWeight: '600' }}>Limpar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Tokens or placeholder */}
          <View style={{ flexDirection: 'column', minHeight: 48 }}>
            {placed.length === 0 ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                <MaterialIcons name="drag-indicator" size={20} color={isDark ? '#2D3139' : '#CBD5E1'} style={{ marginBottom: 4 }} />
                <Text style={{ color: isDark ? '#2D3139' : '#CBD5E1', fontSize: 13 }}>
                  Arraste ou toque nas peças para montar
                </Text>
              </View>
            ) : (
              (() => {
                 const rows: { tokens: (PlacedToken & { globalIndex: number })[], indent: number }[] = [];
                 let currentTokens: (PlacedToken & { globalIndex: number })[] = [];
                 let currentIndent = 0;

                 placed.forEach((p, idx) => {
                   const token = tokenMap.get(p.tokenId);
                   if (!token) return;
                   const val = token.label.trim();
                   
                   if (val === '}' || token.id === 'sym_newline') {
                     if (currentTokens.length > 0) {
                       rows.push({ tokens: currentTokens, indent: currentIndent });
                       currentTokens = [];
                     }
                     if (val === '}') currentIndent = Math.max(0, currentIndent - 1);
                     if (token.id !== 'sym_newline') currentTokens.push({ ...p, globalIndex: idx });

                     const nextId = placed[idx + 1]?.tokenId;
                     const nextToken = nextId ? tokenMap.get(nextId) : null;
                     const nl = nextToken?.label?.trim();
                     if (nl && (nl.toLowerCase() === 'else' || nl === ';')) {
                        // Keep together
                     } else {
                        if (currentTokens.length > 0) {
                          rows.push({ tokens: currentTokens, indent: currentIndent });
                          currentTokens = [];
                        }
                     }
                   } else {
                     currentTokens.push({ ...p, globalIndex: idx });
                     if (val === '{' || val === ';' || val === ':') {
                       rows.push({ tokens: currentTokens, indent: currentIndent });
                       currentTokens = [];
                       if (val === '{' || val === ':') currentIndent++;
                     }
                   }
                 });
                 if (currentTokens.length > 0) rows.push({ tokens: currentTokens, indent: currentIndent });

                 return rows.map((row, rowIdx) => (
                   <View key={`row-${rowIdx}`} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginLeft: row.indent * 20, marginBottom: 4 }}>
                     {row.tokens.map((p) => (
                       <DraxView
                         key={p.instanceId}
                         receptive
                         onReceiveDragDrop={(event) => {
                           const payload = event.dragged.payload;
                           if (payload && typeof payload === 'string') {
                             handleDropOnIndex(payload, p.globalIndex);
                           }
                         }}
                         receivingStyle={{ opacity: 0.7, borderLeftWidth: 3, borderLeftColor: '#10B981', borderRadius: 4 }}
                       >
                         <PuzzlePiece
                           instanceId={p.instanceId}
                           token={tokenMap.get(p.tokenId)!}
                           customLabel={p.customLabel}
                           variant="answer"
                           onPress={() => onRemove(p.instanceId)}
                           onRename={(newLabel) => onRename(p.instanceId, newLabel)}
                           isCorrectPosition={correctFlags[p.globalIndex] || false}
                         />
                       </DraxView>
                     ))}
                   </View>
                 ));
              })()
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
        </DraxView>
      </View>
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
};

export function TokenKeyboard({ pool, allTokens, onAddToken }: TokenKeyboardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const tokenMap = React.useMemo(() => new Map(allTokens.map((t) => [t.id, t])), [allTokens]);

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
        backgroundColor: isDark ? '#111316' : '#F8FAFC',
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
                instanceId={p.instanceId}
                token={token}
                customLabel={p.customLabel}
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
              instanceId={p.instanceId}
              token={token}
              customLabel={p.customLabel}
              variant="key"
              onPress={() => onAddToken(p.instanceId)}
            />
          );
        })}
      </View>
    </View>
  );
}

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
      ? '#059669'
      : isCorrect === false
        ? '#EF4444' /* Vermelho Erro */
        : '#10B981';

  const borderBotColor = disabled
    ? 'transparent'
    : isCorrect === true
      ? '#064E3B'
      : isCorrect === false
        ? '#B91C1C' 
        : '#047857';

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
