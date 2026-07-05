"use client";

import React, { useState } from "react";
import { Square, Circle, Triangle, Minus, PenTool } from "lucide-react";
import { useCanvasStore } from "../../lib/store/canvas-store";
import { ShapeKind } from "../../lib/types/canvas";
import {
  SHAPE_DEFINITIONS,
  isValidSvgPath,
} from "../../lib/services/shape-service";
import { cn } from "../../lib/utils";

interface ShapePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHAPE_OPTIONS: { kind: ShapeKind; icon: React.ElementType }[] = [
  { kind: "rectangle", icon: Square },
  { kind: "circle", icon: Circle },
  { kind: "ellipse", icon: Circle },
  { kind: "triangle", icon: Triangle },
  { kind: "line", icon: Minus },
  { kind: "custom", icon: PenTool },
];

export function ShapePicker({ isOpen, onClose }: ShapePickerProps) {
  const { setActiveTool, setActiveShapeKind, setCustomPathData } =
    useCanvasStore();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customPath, setCustomPath] = useState("");

  const handleSelect = (kind: ShapeKind) => {
    if (kind === "custom") {
      setShowCustomInput(true);
      return;
    }
    setActiveShapeKind(kind);
    setActiveTool("shape");
    onClose();
  };

  const handleCustomConfirm = () => {
    if (!isValidSvgPath(customPath)) return;
    setActiveShapeKind("custom");
    setCustomPathData(customPath);
    setActiveTool("shape");
    setShowCustomInput(false);
    setCustomPath("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-zinc-200 p-2 min-w-[200px]">
      {showCustomInput ? (
        <div className="space-y-2">
          <button
            onClick={() => setShowCustomInput(false)}
            className="text-[11px] text-zinc-500 hover:text-zinc-700"
          >
            ← Back
          </button>
          <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            SVG Path Data
          </label>
          <textarea
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            placeholder="Paste SVG path, e.g. M10 80 Q 95 10 180 80 T 350 80"
            rows={3}
            className="block w-full text-xs border border-zinc-200 px-2 py-1.5 bg-white text-zinc-800 focus:outline-none focus:border-zinc-400 resize-none font-mono"
          />
          <button
            onClick={handleCustomConfirm}
            disabled={!isValidSvgPath(customPath)}
            className={cn(
              "w-full text-xs py-1.5 transition-colors",
              isValidSvgPath(customPath)
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-300 cursor-not-allowed",
            )}
          >
            Confirm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {SHAPE_OPTIONS.map(({ kind, icon: Icon }) => {
            const def = SHAPE_DEFINITIONS[kind];
            const isEllipse = kind === "ellipse";
            return (
              <button
                key={kind}
                onClick={() => handleSelect(kind)}
                className="flex flex-col items-center gap-0.5 px-2 py-2 hover:bg-zinc-50 transition-colors"
              >
                <Icon
                  className={cn(
                    "w-5 h-5 text-zinc-600",
                    isEllipse && "scale-x-150 scale-y-75",
                  )}
                />
                <span className="text-[10px] text-zinc-500">{def.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
