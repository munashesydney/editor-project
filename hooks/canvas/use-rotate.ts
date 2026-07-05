"use client";

import { useCallback } from "react";
import { CanvasElement as CanvasElementType } from "../../lib/types/canvas";

interface UseRotateParams {
  element: CanvasElementType;
  elementRef: React.RefObject<HTMLDivElement | null>;
  onUpdate: (updates: Partial<CanvasElementType>) => void;
}

/**
 * Rotation drag via a handle above the element.
 * Registers mousemove/mouseup directly in the start callback
 * (same pattern as useResize — no effect-based listener trap).
 */
export function useRotate({ element, elementRef, onUpdate }: UseRotateParams) {
  const handleRotateStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const startAngle =
        Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      const startRotation = element.rotation ?? 0;

      const handleMouseMove = (ev: MouseEvent) => {
        const currentAngle =
          Math.atan2(ev.clientY - centerY, ev.clientX - centerX) *
          (180 / Math.PI);
        let delta = currentAngle - startAngle;

        // Snap to 0°/90°/180°/270° when holding Shift
        if (ev.shiftKey) {
          delta = Math.round(delta / 15) * 15;
        }

        let newRotation = (startRotation + delta) % 360;
        if (newRotation < 0) newRotation += 360;

        onUpdate({ rotation: Math.round(newRotation) });
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [element.rotation, elementRef, onUpdate],
  );

  return { handleRotateStart };
}
