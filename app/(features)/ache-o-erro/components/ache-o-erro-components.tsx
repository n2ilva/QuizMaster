import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View, useColorScheme, useWindowDimensions, Platform, Animated } from 'react-native';
import { DraggableTokenWrapper } from '@/components/ui/draggable-token-wrapper';
import { DEBUG_COLORS, LEVEL_CONFIG } from '../ache-o-erro.constants';
import { DebugExercise, PlacedToken, Token, Level, LanguageInfo } from '../ache-o-erro.types';

// ─────────────────────────────────────────────
// Language Selector
// ─────────────────────────────────────────────
type LanguageSelectorProps = {
  languages: LanguageInfo[];
  selected: LanguageInfo;
  onSelect: (lang: LanguageInfo) => void;
};

export function LanguageSelector({ languages, selected, onSelect }: LanguageSelectorProps) {
  const { width } = useWindowDimensions();
  const showText = width >= 640;

  return (
    <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 16, paddingVertical: 6 }}>
      {languages.map((lang) => {
        const active = lang.id === selected.id;
        return (
          <TouchableOpacity
            key={lang.id}
            onPress={() => onSelect(lang)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: active ? lang.color : '#2D3139',
              backgroundColor: active ? `${lang.color}15` : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <MaterialCommunityIcons
              name={lang.icon as any}
              size={showText ? 24 : 28}
              color={active ? lang.color : '#9BA1A6'}
            />
            {showText && (
              <Text
                style={{
                  color: active ? lang.color : '#4B5563',
                  fontSize: 11,
                  fontWeight: active ? '800' : '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {lang.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────
// Level Card
// ─────────────────────────────────────────────
type LevelCardProps = {
  level: Level;
  count: number;
  completedCount: number;
  onPress: () => void;
};

export function LevelCard({ level, count, completedCount, onPress }: LevelCardProps) {
  const config = LEVEL_CONFIG[level];
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexBasis: '47%',
        flexGrow: 1,
        backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: `${config.color}20`,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        gap: 8,
        shadowColor: config.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View style={{ 
        width: 48, 
        height: 48, 
        borderRadius: 16, 
        backgroundColor: `${config.color}15`, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: `${config.color}30`
      }}>
        <MaterialIcons name={config.icon as any} size={28} color={config.color} />
      </View>
      
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: isDark ? '#ECEDEE' : '#11181C', fontSize: 15, fontWeight: '800', textAlign: 'center' }}>
          {config.label}
        </Text>
        <Text style={{ color: DEBUG_COLORS.textMuted, fontSize: 12, marginTop: 4 }}>
          {completedCount} / {count} concluídos
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Exercise Card
// ─────────────────────────────────────────────
type ExerciseCardProps = {
  exercise: DebugExercise;
  onPress: () => void;
  completed?: boolean;
};

export function ExerciseCard({ exercise, onPress, completed }: ExerciseCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const config = LEVEL_CONFIG[exercise.level];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: isDark ? '#1C1F24' : '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: completed ? `${DEBUG_COLORS.success}44` : '#30363D',
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: completed ? `${DEBUG_COLORS.success}15` : `${config.color}15`,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <MaterialIcons 
          name={completed ? "check-circle" : "bug-report"} 
          size={24} 
          color={completed ? DEBUG_COLORS.success : config.color} 
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: isDark ? '#ECEDEE' : '#11181C', fontSize: 16, fontWeight: '700' }}>
          {exercise.title}
        </Text>
        <Text style={{ color: DEBUG_COLORS.textMuted, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
          {exercise.description}
        </Text>
      </View>

      <MaterialIcons name="chevron-right" size={24} color={DEBUG_COLORS.textMuted} />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Debug Token
// ─────────────────────────────────────────────
type DebugTokenProps = {
  token: Token;
  instanceId: string;
  onPress?: () => void;
  variant: 'pool' | 'code';
  receptive?: boolean;
  onReceiveDragDrop?: (event: any) => void;
  isCorrectPosition?: boolean;
};

export function DebugToken({ 
  token, 
  instanceId, 
  onPress, 
  variant, 
  receptive, 
  onReceiveDragDrop,
  isCorrectPosition = false
}: DebugTokenProps) {
  const isPool = variant === 'pool';
  const isTouchDevice =
    Platform.OS !== 'web' ||
    (typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches);
  const dragLiftY = isTouchDevice ? -64 : 0;

  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isCorrectPosition && !isPool) {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          delay: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!isCorrectPosition) {
      glowAnim.setValue(0);
    }
  }, [isCorrectPosition, isPool, glowAnim]);
  
  return (
    <DraggableTokenWrapper
      dragPayload={isPool ? `pool_${instanceId}` : `code_${instanceId}`}
      receptive={receptive}
      onReceiveDragDrop={onReceiveDragDrop}
      draggingStyle={{
        opacity: 0.9,
        transform: [{ translateY: dragLiftY }],
        zIndex: 1000,
      }}
      dragReleasedStyle={{ opacity: 1 }}
      hoverDraggingStyle={{ opacity: 0.8 }}
      receivingStyle={{
        borderColor: '#10B981',
        borderWidth: 2.5,
        borderRadius: 5,
        backgroundColor: 'rgba(16, 185, 129, 0.22)',
        transform: [{ scale: 1.22 }],
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 30,
      }}
    >
      <View style={{ position: 'relative', margin: 2 }}>
        <Animated.View style={{
          position: 'absolute',
          top: -3, bottom: -3, left: -3, right: -3,
          backgroundColor: '#10B981',
          borderRadius: 10,
          opacity: glowAnim,
        }} />
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 8,
            backgroundColor: isPool ? '#1F2937' : '#111316',
            borderWidth: 1.5,
            borderColor: isPool ? '#374151' : '#1E2328',
            borderBottomWidth: 3,
            minWidth: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <Text style={{ 
            color: isPool ? '#E5E7EB' : '#10B981', 
            fontSize: 14, 
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
            fontWeight: '800' 
          }}>
            {token.value}
          </Text>
        </TouchableOpacity>
      </View>
    </DraggableTokenWrapper>
  );
}

type ExerciseHeaderProps = {
  exercise: DebugExercise;
  isDark: boolean;
  hintCount: number;
  onClose: () => void;
  onOpenHints: () => void;
};

export function ExerciseHeader({ exercise, isDark, hintCount, onClose, onOpenHints }: ExerciseHeaderProps) {
  return (
    <View style={{ padding: 12, flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 12 }}>
      <TouchableOpacity onPress={onClose} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1C1F24', alignItems: 'center', justifyContent: 'center' }}>
        <MaterialIcons name="close" size={20} color={isDark ? '#ECEDEE' : '#11181C'} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#ECEDEE' }}>{exercise.title}</Text>
        <Text style={{ fontSize: 14, color: DEBUG_COLORS.textMuted, marginTop: 4, lineHeight: 20 }}>{exercise.description}</Text>
      </View>
      <TouchableOpacity
        onPress={onOpenHints}
        disabled={hintCount === 0}
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: '#1C1F24',
          borderWidth: 1,
          borderColor: '#30363D',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          opacity: hintCount === 0 ? 0.5 : 1,
        }}
      >
        <MaterialIcons name="help-outline" size={20} color="#ECEDEE" />
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -2,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: DEBUG_COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}
        >
          <Text style={{ color: '#11181C', fontSize: 10, fontWeight: '900' }}>{hintCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

type HintsModalProps = {
  visible: boolean;
  hints: string[];
  currentHintIndex: number;
  onClose: () => void;
  onNextHint: () => void;
};

export function HintsModal({ visible, hints, currentHintIndex, onClose, onNextHint }: HintsModalProps) {
  const totalHints = hints.length;
  const hasNextHint = currentHintIndex < totalHints - 1;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <View
          style={{
            width: '100%',
            maxWidth: 420,
            backgroundColor: '#1C1F24',
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#30363D',
            padding: 18,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#ECEDEE' }}>Dicas do Exercício</Text>
            <TouchableOpacity onPress={onClose} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#252930', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="close" size={18} color="#ECEDEE" />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 12, fontWeight: '700', color: DEBUG_COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.7 }}>
            Dica {Math.min(currentHintIndex + 1, totalHints)} de {totalHints}
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: '#D1D5DB', minHeight: 88 }}>
            {totalHints > 0 ? hints[currentHintIndex] : 'Nenhuma dica disponível para este exercício.'}
          </Text>

          <View style={{ marginTop: 8, flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#3A3F47', backgroundColor: '#252930' }}
            >
              <Text style={{ color: '#ECEDEE', fontWeight: '700', fontSize: 14 }}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!hasNextHint}
              onPress={onNextHint}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: DEBUG_COLORS.primary,
                opacity: hasNextHint ? 1 : 0.55,
              }}
            >
              <Text style={{ color: '#11181C', fontWeight: '800', fontSize: 14 }}>{hasNextHint ? 'Próxima dica' : 'Última dica'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
