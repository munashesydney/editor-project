"use client";

import { useRef, useLayoutEffect } from "react";
import { CanvasElement as CanvasElementType } from "../../lib/types/canvas";

interface UseTextAutoSizeParams {
  element: CanvasElementType;
  isText: boolean;
  textContentRef: React.RefObject<HTMLDivElement | null>;
  onUpdate: (updates: Partial<CanvasElementType>) => void;
}

const MIN_HEIGHT = 24;

/**
 * Auto-sizes a text element's container height to fit its content.
 * Width is intentionally left alone — the user controls it via corner handles.
 * Runs when content or any text style property changes.
 * Uses a last-applied height ref with 1px tolerance to prevent
 * subpixel-churn infinite loops.
 */
export function useTextAutoSize({
  element,
  isText,
  textContentRef,
  onUpdate,
}: UseTextAutoSizeParams) {
  const lastAppliedHeightRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!isText || !textContentRef.current) return;

    const content = textContentRef.current;
    const targetHeight = Math.max(content.scrollHeight, MIN_HEIGHT);

    const last = lastAppliedHeightRef.current;
    if (last !== null && Math.abs(targetHeight - last) <= 1) return;

    lastAppliedHeightRef.current = targetHeight;
    onUpdate({
      dimensions: {
        width: element.dimensions.width,
        height: targetHeight,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    element.content,
    element.style?.fontSize,
    element.style?.fontFamily,
    element.style?.fontWeight,
    element.style?.fontStyle,
    isText,
    textContentRef,
    onUpdate,
  ]);
}
