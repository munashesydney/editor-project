import React from "react";
import { useCanvasStore } from "../../lib/store/canvas-store";
import { cn } from "../../lib/utils";
import { Type, PaintBucket, Trash2, MoreHorizontal, ArrowLeftRight } from "lucide-react";

interface FloatingToolbarProps {
  scale: number;
}

export function FloatingToolbar({ scale }: FloatingToolbarProps) {
  const { elements, selectedId, panelPosition, setPanelPosition, setActivePanel, deleteElement } = useCanvasStore();

  const selectedElement = elements.find((el) => el.id === selectedId);

  if (!selectedElement) return null;

  // The toolbar floats slightly above the element
  // We apply a counter-scale so the UI remains consistently sized regardless of canvas zoom
  return (
    <div
      className="absolute z-50 flex items-center bg-white shadow-xl rounded-lg border border-zinc-200 px-1 py-1"
      style={{
        left: selectedElement.position.x,
        top: selectedElement.position.y - 12, // slightly above
        transform: `scale(${1 / scale}) translateY(-100%)`,
        transformOrigin: "bottom left",
      }}
    >
      {selectedElement.type === "text" && (
        <>
          <button
            onClick={() => setActivePanel("text")}
            className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-700"
            title="Text Options"
          >
            <Type className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-zinc-200 mx-1" />
        </>
      )}

      {selectedElement.type === "shape" && (
        <>
          <button
            onClick={() => setActivePanel("shape")}
            className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-700"
            title="Shape Options"
          >
            <PaintBucket className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-zinc-200 mx-1" />
        </>
      )}

      <button
        onClick={() => {
          if (selectedId) deleteElement(selectedId);
        }}
        className="p-2 hover:bg-zinc-100 hover:text-red-600 rounded-md transition-colors text-zinc-700"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-zinc-200 mx-1" />

      <button 
        onClick={() => setPanelPosition(panelPosition === "left" ? "right" : "left")}
        className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-700" 
        title="Switch Sides"
      >
        <ArrowLeftRight className="w-4 h-4" />
      </button>

      {/* Placeholder for more options */}
      <button className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-700" title="More">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
