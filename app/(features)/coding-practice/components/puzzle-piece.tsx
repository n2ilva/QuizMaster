import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View, Animated } from 'react-native';
import { DraggableTokenWrapper } from '@/components/ui/draggable-token-wrapper';

import { TOKEN_CATEGORY_COLORS } from '../coding-practice.constants';
import { type SyntaxToken } from '../coding-practice.types';

type PuzzlePieceProps = {
  token: SyntaxToken;
  customLabel?: string;
  onPress?: () => void;
  onRename?: (newLabel: string) => void;
  showRemove?: boolean;
  onRemove?: () => void;
  used?: boolean;
  variant?: 'key' | 'answer';
  instanceId?: string;
  isCorrectPosition?: boolean;
  isSelected?: boolean;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onToggleSelect?: () => void;
};

export function PuzzlePiece({
  token,
  customLabel,
  onPress,
  onRename,
  showRemove = false,
  onRemove,
  used = false,
  variant = 'key',
  instanceId,
  isCorrectPosition = false,
  isSelected = false,
  onMoveLeft,
  onMoveRight,
  onToggleSelect,
}: PuzzlePieceProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [draftLabel, setDraftLabel] = useState(customLabel ?? token.label);

  const colors = TOKEN_CATEGORY_COLORS[token.category] ?? TOKEN_CATEGORY_COLORS.symbol;
  const displayLabel = customLabel ?? token.label;
  const isKey = variant === 'key';

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCorrectPosition && !isKey) {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.9,
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
  }, [isCorrectPosition, isKey]);

  function handleConfirmEdit() {
    const trimmed = draftLabel.trim();
    if (trimmed && onRename) onRename(trimmed);
    setEditModalVisible(false);
  }

  // Key style (keyboard look)
  if (isKey) {
    const keyContent = (
      <>
        <TouchableOpacity
          onPress={used ? undefined : onPress}
          onLongPress={() => {
            if (token.editable && onRename) {
              setDraftLabel(customLabel ?? token.label);
              setEditModalVisible(true);
            }
          }}
          disabled={used}
          activeOpacity={0.6}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 6,
            paddingVertical: 4,
            borderRadius: 4,
            backgroundColor: used ? 'transparent' : 'rgba(255,255,255,0.06)',
            opacity: used ? 0.3 : 1,
            minWidth: 24,
            ...(Platform.OS === 'web' && !used && {
              cursor: 'pointer',
            } as any),
          }}
        >
          <Text
            style={{
              color: used ? '#4B5563' : colors.text,
              fontSize: 15,
              fontWeight: '500',
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              letterSpacing: 0.5,
            }}
          >
            {displayLabel}
          </Text>
        </TouchableOpacity>
        {renderModal()}
      </>
    );

    if (used || !instanceId) {
      return keyContent;
    }

    return (
      <DraggableTokenWrapper
        dragPayload={`kb_${instanceId}`}
        draggingStyle={{ opacity: 0.5 }}
        dragReleasedStyle={{ opacity: 0.5 }}
        hoverDraggingStyle={{ opacity: 0.8 }}
      >
        {keyContent}
      </DraggableTokenWrapper>
    );
  }

  // Answer variant (inside the answer area)
  return (
    <View style={{ position: 'relative', marginHorizontal: 3, marginVertical: 3, zIndex: isSelected ? 10 : 1 }}>
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
        top: -4, bottom: -4, left: -4, right: -4,
        backgroundColor: '#10B981',
        borderRadius: 12,
        opacity: glowAnim,
      }} />
      <DraggableTokenWrapper
        dragPayload={`ans_${instanceId}`}
        draggingStyle={{ opacity: 0.5 }}
      >
        <TouchableOpacity
        onPress={onToggleSelect}
        onLongPress={() => {
          if (token.editable && onRename) {
            setDraftLabel(customLabel ?? token.label);
            setEditModalVisible(true);
          }
        }}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 6,
          paddingVertical: 4,
          borderRadius: 4,
          backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : isCorrectPosition ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
          minWidth: 24,
          borderWidth: isSelected ? 1 : 0,
          borderColor: isSelected ? '#E2E8F0' : 'transparent',
        }}
      >
        <Text
          style={{
            color: isCorrectPosition ? '#10B981' : colors.text,
            fontSize: 15,
            fontWeight: isCorrectPosition ? '800' : '500',
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            letterSpacing: 0.5,
          }}
        >
          {displayLabel}
        </Text>
      </TouchableOpacity>
      </DraggableTokenWrapper>
      {renderModal()}
    </View>
  );

  // Shared rename modal
  function renderModal() {
    return (
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setEditModalVisible(false)}
        >
          <Pressable
            onPress={() => undefined}
            style={{
              backgroundColor: '#1A1D21',
              borderRadius: 16,
              padding: 24,
              width: 300,
              borderWidth: 1,
              borderColor: '#2D3139',
            }}
          >
            <Text style={{ color: '#ECEDEE', fontWeight: '700', fontSize: 16, marginBottom: 4 }}>
              Renomear
            </Text>
            <Text style={{ color: '#687076', fontSize: 12, marginBottom: 14 }}>
              Edite o nome deste identificador:
            </Text>
            <TextInput
              value={draftLabel}
              onChangeText={setDraftLabel}
              autoFocus
              style={{
                backgroundColor: '#0D0F10',
                borderRadius: 10,
                borderWidth: 2,
                borderColor: colors.border,
                color: colors.text,
                fontFamily: 'monospace',
                fontSize: 15,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginBottom: 18,
              }}
              onSubmitEditing={handleConfirmEdit}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => setEditModalVisible(false)}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#2D3139',
                  alignItems: 'center',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ color: '#9BA1A6', fontSize: 14 }}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmEdit}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 10,
                  backgroundColor: colors.border,
                  alignItems: 'center',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>OK</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
}
