import { useCallback } from 'react';
import { useDndMonitor } from '@dnd-kit/core';

export const useDragAndDrop = (onDragEnd) => {
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      onDragEnd(event);
    }
  }, [onDragEnd]);

  useDndMonitor({
    onDragEnd: handleDragEnd,
  });

  return {
    handleDragEnd,
  };
};

export default useDragAndDrop;
