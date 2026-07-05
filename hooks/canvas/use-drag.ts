"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CanvasElement as CanvasElementType } from "../../lib/types/canvas";

interface UseDragParams {
  element: CanvasElementType;
  canvasBounds: { width: number; height: number };
  elementRef: React.RefObject<HTMLDivElement | null>;
  isText: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasElementType>) => void;
}

/**
 * Handles mouse-drag to reposition the element on the canvas.
 */
export function useDrag({
  element,
  canvasBounds,
  elementRef,
  isText,
  isEditing,
  onSelect,
  onUpdate,
}: UseDragParams) {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) return;
      e.stopPropagation();
      onSelect();
      setIsDragging(true);

      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        dragOffset.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    },
    [isEditing, onSelect, elementRef],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = elementRef.current?.closest("[data-canvas]");
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const scale = canvasBounds.width / canvasRect.width;

      const actualWidth = isText
        ? (elementRef.current?.offsetWidth ?? element.dimensions.width)
        : element.dimensions.width;
      const actualHeight = isText
        ? (elementRef.current?.offsetHeight ?? element.dimensions.height)
        : element.dimensions.height;

      let newX =
        e.clientX - canvasRect.left - dragOffset.current.x * scale;
      let newY =
        e.clientY - canvasRect.top - dragOffset.current.y * scale;

      newX = Math.max(0, Math.min(newX, canvasBounds.width - actualWidth));
      newY = Math.max(0, Math.min(newY, canvasBounds.height - actualHeight));

      onUpdate({ position: { x: newX, y: newY } });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    canvasBounds,
    element.dimensions,
    isText,
    elementRef,
    onUpdate,
  ]);

  return { isDragging, handleMouseDown };
}
