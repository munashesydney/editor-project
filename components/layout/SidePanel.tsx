"use client";

import React from "react";
import { cn } from "../../lib/utils";

interface SidePanelProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  variant?: "drawer" | "floating";
  position?: "left" | "right";
  onClose?: () => void;
}

/**
 * Reusable panel that can act as a fixed drawer or a floating relative card.
 */
export function SidePanel({ open, title, children, variant = "drawer", position = "left", onClose }: SidePanelProps) {
  const isFloating = variant === "floating";

  return (
    <div
      className={cn(
        "z-40 flex flex-col bg-white transition-all duration-300 ease-in-out",
        isFloating
          ? cn("relative rounded-xl shadow-lg border border-zinc-200 my-4 h-[calc(100%-32px)]", position === "left" ? "ml-4" : "mr-4")
          : "fixed top-0 right-0 bottom-0",
        open
          ? cn("w-80 opacity-100", !isFloating && "border-l-0")
          : cn(
              "w-0 opacity-0 pointer-events-none overflow-hidden", 
              isFloating ? cn("border-none", position === "left" ? "ml-0" : "mr-0") : "border-l border-zinc-200"
            )
      )}
    >
      <div
        className={cn(
          "h-12 shrink-0 flex items-center justify-between px-4",
          open ? "border-b-0" : "border-b border-zinc-200"
        )}
      >
        <span className="text-sm font-medium text-zinc-800 tracking-tight">
          {title}
        </span>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded-md text-zinc-500 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
