"use client";

import { useCanvasStore } from "../../lib/store/canvas-store";

/**
 * Opens the native file picker, reads the selected image,
 * and places it on the canvas at the default position.
 */
export function openImagePicker(): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;

      // Measure natural dimensions to preserve aspect ratio
      const img = new Image();
      img.onload = () => {
        const maxDim = 250;
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        // Scale down if larger than maxDim on the longest side
        if (w > maxDim || h > maxDim) {
          const ratio = maxDim / Math.max(w, h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        useCanvasStore
          .getState()
          .addImage(dataUrl, { x: 150, y: 100 }, { width: w, height: h });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  input.click();
}
