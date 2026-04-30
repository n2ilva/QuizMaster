import React from 'react';
import { ViewStyle } from 'react-native';
import { DraxView } from 'react-native-drax';

type DraggableTokenWrapperProps = {
  dragPayload?: string;
  receptive?: boolean;
  onReceiveDragDrop?: (event: any) => void;
  draggingStyle?: ViewStyle;
  dragReleasedStyle?: ViewStyle;
  hoverDraggingStyle?: ViewStyle;
  receivingStyle?: ViewStyle;
  children: React.ReactNode;
};

export function DraggableTokenWrapper({
  dragPayload,
  receptive = false,
  onReceiveDragDrop,
  draggingStyle,
  dragReleasedStyle,
  hoverDraggingStyle,
  receivingStyle,
  children,
}: DraggableTokenWrapperProps) {
  return (
    <DraxView
      dragPayload={dragPayload}
      receptive={receptive}
      onReceiveDragDrop={onReceiveDragDrop}
      draggingStyle={draggingStyle}
      dragReleasedStyle={dragReleasedStyle}
      hoverDraggingStyle={hoverDraggingStyle}
      receivingStyle={receivingStyle}
      longPressDelay={150}
    >
      {children}
    </DraxView>
  );
}
