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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const isHovered = hovered || pressed;
  
  const colorTheme = config.color;
  const iconName = level === 'junior' ? 'star-border' : level === 'pleno' ? 'star-half' : 'star';

  const bg = isDark ? '#1C1F24' : '#FFFFFF';
  const borderStatic = isDark ? `${colorTheme}20` : `${colorTheme}15`;
  const borderHover = isDark ? `${colorTheme}60` : `${colorTheme}40`;
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.9}
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
        <Text style={{ color: textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: -0.3, textAlign: 'center' }}>{config.label}</Text>
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
  isLastMoved?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onRemove?: () => void;
};

export function DebugToken({ 
  token, 
  instanceId, 
  onPress, 
  variant, 
  receptive, 
  onReceiveDragDrop,
  isCorrectPosition = false,
  isLastMoved = false,
  isSelected = false,
  onToggleSelect,
  onMoveLeft,
  onMoveRight,
  onRemove
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
    // Only flash if it's the piece that just moved AND it's correct
    if (isCorrectPosition && isLastMoved && !isPool) {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          delay: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!isCorrectPosition) {
      glowAnim.setValue(0);
    }
  }, [isCorrectPosition, isLastMoved, isPool, glowAnim]);
  
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
      <View style={{ position: 'relative', marginHorizontal: 2, marginVertical: 2, zIndex: isSelected ? 10 : 1 }}>
        {isSelected && (
          <View style={{ 
            position: 'absolute', 
            top: -38, 
            alignSelf: 'center',
            flexDirection: 'row', 
            backgroundColor: '#1A1D21', 
            borderRadius: 8, 
            padding: 4, 
            gap: 8,
            zIndex: 20,
            borderWidth: 1,
            borderColor: '#30363D',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <TouchableOpacity onPress={onMoveLeft} hitSlop={8} style={{ padding: 4, backgroundColor: '#2D3139', borderRadius: 6 }}>
              <MaterialIcons name="chevron-left" size={18} color="#ECEDEE" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onRemove} hitSlop={8} style={{ padding: 4, backgroundColor: '#4C1D1D', borderRadius: 6 }}>
              <MaterialIcons name="close" size={18} color="#FF5F56" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onMoveRight} hitSlop={8} style={{ padding: 4, backgroundColor: '#2D3139', borderRadius: 6 }}>
              <MaterialIcons name="chevron-right" size={18} color="#ECEDEE" />
            </TouchableOpacity>
          </View>
        )}
        <Animated.View style={{
          position: 'absolute',
          top: -3, bottom: -3, left: -3, right: -3,
          backgroundColor: '#10B981',
          borderRadius: 10,
          opacity: glowAnim,
        }} />
        <TouchableOpacity
          onPress={isPool ? onPress : onToggleSelect}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: 6,
            paddingVertical: 4,
            borderRadius: 4,
            backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : (isPool 
              ? 'rgba(255,255,255,0.06)' 
              : (isCorrectPosition ? 'rgba(16, 185, 129, 0.12)' : 'transparent')),
            minWidth: 24,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: isSelected ? 1 : 0,
            borderColor: isSelected ? '#E2E8F0' : 'transparent',
          }}
        >
          <Text style={{ 
            color: isPool ? '#9BA1A6' : (isCorrectPosition ? '#10B981' : '#E5E7EB'), 
            fontSize: 15, 
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
            fontWeight: isCorrectPosition ? '800' : '500',
            letterSpacing: 0.5,
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
