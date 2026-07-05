"use client";

import React, { useState, useEffect } from "react";
import { SidePanel } from "../layout/SidePanel";
import { useCanvasStore } from "../../lib/store/canvas-store";
import {
  SHAPE_DEFINITIONS,
  SHAPE_KIND_LIST,
  isValidSvgPath,
  buildShapeStyleInline,
} from "../../lib/services/shape-service";
import { ShapeKind } from "../../lib/types/canvas";
import { cn } from "../../lib/utils";

export function ShapeEditorSheet({ open }: { open: boolean }) {
  const { elements, selectedId, updateElement, setActivePanel, panelPosition } = useCanvasStore();
  const [customPath, setCustomPath] = useState("");

  const selectedElement = elements.find((el) => el.id === selectedId);
  const isShapeSelected = selectedElement?.type === "shape";
  const style = selectedElement?.style ?? {};
  const rotation = selectedElement?.rotation ?? 0;

  const kind = (style.shapeKind as ShapeKind) || "rectangle";

  useEffect(() => {
    if (kind === "custom") {
      setCustomPath(style.pathData || "");
    }
  }, [kind, style.pathData]);

  const updateStyle = (updates: Record<string, unknown>) => {
    if (!selectedId) return;
    updateElement(selectedId, {
      style: { ...style, ...updates },
    });
  };

  const updateRotation = (deg: number) => {
    if (!selectedId) return;
    updateElement(selectedId, { rotation: deg });
  };

  return (
    <SidePanel 
      open={open} 
      title="Shape Settings"
      variant="floating"
      position={panelPosition}
      onClose={() => setActivePanel(null)}
    >
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 min-w-0">
        {/* Shape Kind */}
        <fieldset>
          <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
            Shape Type
          </label>
          <select
            value={kind}
            onChange={(e) => {
              const newKind = e.target.value as ShapeKind;
              const def = SHAPE_DEFINITIONS[newKind];
              updateStyle({ ...def.defaultStyle });
            }}
            className="block w-full text-sm border border-zinc-200 rounded-none px-2.5 py-1.5 bg-white text-zinc-800 focus:outline-none focus:border-zinc-400"
          >
            {SHAPE_KIND_LIST.map((def) => (
              <option key={def.kind} value={def.kind}>
                {def.label}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Fill Color */}
        <fieldset>
          <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
            Fill Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.backgroundColor || "#3b82f6"}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              className="w-8 h-8 p-0.5 border border-zinc-200 cursor-pointer bg-white"
            />
            <input
              type="text"
              value={style.backgroundColor || "#3b82f6"}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              className="flex-1 text-sm border border-zinc-200 rounded-none px-2 py-1 bg-white text-zinc-800 font-mono focus:outline-none focus:border-zinc-400"
            />
          </div>
        </fieldset>

        {/* Border Width */}
        <fieldset>
          <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
            Border Width
          </label>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={style.borderWidth || 0}
            onChange={(e) =>
              updateStyle({ borderWidth: Number(e.target.value) })
            }
            className="w-full h-1.5 accent-zinc-900"
          />
          <span className="text-xs text-zinc-500">
            {style.borderWidth || 0}px
          </span>
        </fieldset>

        {/* Border Color */}
        <fieldset>
          <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
            Border Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.borderColor || "#000000"}
              onChange={(e) => updateStyle({ borderColor: e.target.value })}
              className="w-8 h-8 p-0.5 border border-zinc-200 cursor-pointer bg-white"
            />
            <input
              type="text"
              value={style.borderColor || "#000000"}
              onChange={(e) => updateStyle({ borderColor: e.target.value })}
              className="flex-1 text-sm border border-zinc-200 rounded-none px-2 py-1 bg-white text-zinc-800 font-mono focus:outline-none focus:border-zinc-400"
            />
          </div>
        </fieldset>

        {/* Border Radius (only for rect/custom) */}
        {(kind === "rectangle" || kind === "custom") && (
          <fieldset>
            <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
              Corner Radius
            </label>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={style.borderRadius ?? 8}
              onChange={(e) =>
                updateStyle({ borderRadius: Number(e.target.value) })
              }
              className="w-full h-1.5 accent-zinc-900"
            />
            <span className="text-xs text-zinc-500">
              {style.borderRadius ?? 8}%
            </span>
          </fieldset>
        )}

        {/* Custom SVG path */}
        {kind === "custom" && (
          <fieldset>
            <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
              SVG Path Data
            </label>
            <textarea
              value={customPath}
              onChange={(e) => {
                setCustomPath(e.target.value);
                if (isValidSvgPath(e.target.value)) {
                  updateStyle({ pathData: e.target.value });
                }
              }}
              placeholder="M10 80 Q 95 10 180 80 T 350 80"
              rows={4}
              className="block w-full text-xs border border-zinc-200 px-2 py-1.5 bg-white text-zinc-800 focus:outline-none focus:border-zinc-400 resize-none font-mono"
            />
            <span
              className={cn(
                "text-[10px] mt-0.5",
                isValidSvgPath(customPath)
                  ? "text-green-600"
                  : customPath
                    ? "text-red-500"
                    : "text-zinc-400",
              )}
            >
              {customPath
                ? isValidSvgPath(customPath)
                  ? "Valid SVG path"
                  : "Invalid path — must start with M, L, C, Q, etc."
                : "Paste an SVG path string (d-attribute)"}
            </span>
          </fieldset>
        )}

        {/* Rotation */}
        <fieldset>
          <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
            Rotation
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => updateRotation(Number(e.target.value))}
              className="flex-1 h-1.5 accent-zinc-900"
            />
            <span className="w-10 text-xs text-zinc-500 text-right tabular-nums">
              {rotation}°
            </span>
          </div>
        </fieldset>

        {/* Preview */}
        <div className="pt-2 border-t border-zinc-100">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
            Preview
          </p>
          <div
            className="mx-auto border border-zinc-100 bg-zinc-50 flex items-center justify-center"
            style={{ width: 100, height: 100 }}
          >
            <div
              style={{
                width: kind === "line" ? "80%" : 60,
                height: kind === "line" ? 3 : 60,
                ...buildShapeStyleInline(style),
              }}
            />
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
