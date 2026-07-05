"use client";

import React from "react";
import { cn } from "../../lib/utils";

interface SidePanelProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
}

/**
 * Reusable right-side panel with the same fixed layout,
 * slide animation, and header design as the AI chat panel.
 */
export function SidePanel({ open, title, children }: SidePanelProps) {
  return (
    <div
      className={cn(
        "fixed top-0 right-0 bottom-0 z-40 flex flex-col bg-white",
        "transition-all duration-300 ease-in-out",
        open
          ? "w-80 opacity-100 border-l-0"
          : "w-0 opacity-0 pointer-events-none overflow-hidden border-l border-zinc-200",
      )}
    >
      {/* Navbar-height spacer — creates visual immersion with the navbar */}
      <div
        className={cn(
          "h-12 shrink-0 flex items-center px-4",
          open ? "border-b-0" : "border-b border-zinc-200",
        )}
      >
        <span className="text-sm font-medium text-zinc-800 tracking-tight">
          {title}
        </span>
      </div>

      {children}
    </div>
  );
}
