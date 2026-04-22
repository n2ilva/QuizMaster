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
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 10,
            borderStyle: 'solid',
            backgroundColor: used ? 'transparent' : '#1F2937',
            borderWidth: 1.5,
            borderColor: used ? '#111316' : '#374151',
            borderBottomWidth: used ? 1.5 : 4,
            opacity: used ? 0.3 : 1,
            minWidth: 36,
            minHeight: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
            ...(Platform.OS === 'web' && !used && {
              cursor: 'pointer',
            } as any),
          }}
        >
          <Text
            style={{
              color: used ? '#4B5563' : '#E5E7EB',
              fontSize: 14,
              fontWeight: '800',
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              letterSpacing: 0.1,
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
    <View style={{ position: 'relative', marginHorizontal: 3, marginVertical: 3 }}>
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
        onPress={onPress}
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
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: 10,
          borderStyle: 'solid',
          borderWidth: 1.5,
          borderBottomWidth: 4,
          backgroundColor: '#0D0F12',
          borderColor: '#1E2328',
          minHeight: 34,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text
          style={{
            color: '#10B981',
            fontSize: 14,
            fontWeight: '900',
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            letterSpacing: 0.1,
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
