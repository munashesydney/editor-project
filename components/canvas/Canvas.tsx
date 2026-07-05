"use client";

import React, { useRef, useEffect } from "react";
import { CanvasElement } from "../../lib/types/canvas";
import { useCanvasStore } from "../../lib/store/canvas-store";
import { DraggableElement } from "./CanvasElement";
import { TextEditorSheet } from "./TextEditorSheet";
import { ShapeEditorSheet } from "./ShapeEditorSheet";
import { DesignSheet } from "../layout/DesignSheet";
import { HelpCircle } from "lucide-react";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    elements,
    selectedId,
    activeTool,
    selectElement,
    deselectAll,
    updateElement,
    deleteElement,
    addElement,
  } = useCanvasStore();

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      deselectAll();

      if (activeTool !== "select" && activeTool !== "image") {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scale = CANVAS_WIDTH / rect.width;
        const x = (e.clientX - rect.left) * scale;
        const y = (e.clientY - rect.top) * scale;

        addElement(activeTool, { x: x - 75, y: y - 40 });
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        deleteElement(selectedId);
      }
      if (e.key === "Escape") {
        deselectAll();
      }
      // Tool shortcuts
      if (e.key === "v" || e.key === "V") {
        useCanvasStore.getState().setActiveTool("select");
      }
      if (e.key === "t" || e.key === "T") {
        useCanvasStore.getState().setActiveTool("text");
      }
      if (e.key === "r" || e.key === "R") {
        useCanvasStore.getState().setActiveTool("shape");
      }
      if (e.key === "i" || e.key === "I") {
        useCanvasStore.getState().setActiveTool("image");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, deleteElement, deselectAll]);

  const handleElementUpdate =
    (id: string) => (updates: Partial<CanvasElement>) => {
      if (Object.keys(updates).length === 0 && selectedId === id) {
        deleteElement(id);
      } else {
        updateElement(id, updates);
      }
    };

  return (
    <DesignSheet
      className="relative"
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        maxWidth: "calc(100vw - 400px)",
        aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`,
        minWidth: 400,
        minHeight: 300,
      }}
    >
      <div
        ref={canvasRef}
        data-canvas
        onClick={handleCanvasClick}
        className="absolute inset-0"
      >
        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedId === element.id}
            onSelect={() => selectElement(element.id)}
            onUpdate={handleElementUpdate(element.id)}
            canvasBounds={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          />
        ))}

        {!elements.length && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 pointer-events-none">
            <HelpCircle className="w-6 h-6 mb-2 text-zinc-300" />
            <p className="text-sm font-medium text-zinc-500">Canvas is empty</p>
            <p className="text-xs text-zinc-400 mt-1">
              Use the toolbar or press T, R, I to add elements
            </p>
          </div>
        )}
      </div>

      <TextEditorSheet />
      <ShapeEditorSheet />
    </DesignSheet>
  );
}
