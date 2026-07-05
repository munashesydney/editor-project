"use client";

import { useState } from "react";
import { Image, Type, Square, MousePointer2, Sparkles } from "lucide-react";
import { useCanvasStore } from "../../lib/store/canvas-store";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ShapePicker } from "./ShapePicker";
import { openImagePicker } from "../../lib/services/image-service";

const tools = [
  { id: "select", icon: MousePointer2, label: "Select (V)" },
  { id: "text", icon: Type, label: "Text (T)" },
  { id: "shape", icon: Square, label: "Shape (R)" },
  { id: "image", icon: Image, label: "Image (I)" },
] as const;

interface ToolbarProps {
  onOpenAI: () => void;
  aiPanelOpen: boolean;
}

export function Toolbar({ onOpenAI, aiPanelOpen }: ToolbarProps) {
  const { activeTool, setActiveTool } = useCanvasStore();
  const [shapePickerOpen, setShapePickerOpen] = useState(false);

  const handleToolClick = (toolId: string) => {
    if (toolId === "shape") {
      setShapePickerOpen((prev) => {
        if (prev) {
          setActiveTool("select");
        }
        return !prev;
      });
    } else if (toolId === "image") {
      setShapePickerOpen(false);
      openImagePicker();
    } else {
      setShapePickerOpen(false);
      setActiveTool(toolId as typeof activeTool);
    }
  };

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex items-stretch gap-2">
        {/* Tool buttons */}
        <div className="flex items-center bg-white border border-zinc-200 shadow-sm relative">
          <div className="flex items-center p-1 gap-0.5">
            {tools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleToolClick(tool.id)}
                    className={cn(
                      "p-2.5 transition-all duration-150",
                      activeTool === tool.id ||
                        (tool.id === "shape" && shapePickerOpen)
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50",
                    )}
                  >
                    <tool.icon className="w-[18px] h-[18px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {tool.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Shape picker drop-up */}
          <ShapePicker
            isOpen={shapePickerOpen}
            onClose={() => setShapePickerOpen(false)}
          />
        </div>

        {/* AI toggle */}
        <div className="flex items-center bg-white border border-zinc-200 shadow-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onOpenAI}
                className={cn(
                  "p-2.5 transition-all duration-150",
                  aiPanelOpen
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50",
                )}
              >
                <Sparkles className="w-[18px] h-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              AI Assistant
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
