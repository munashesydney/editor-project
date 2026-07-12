"use client";

import { useEffect, useRef } from "react";
import { useCanvasStore } from "@/lib/store/canvas-store";
import { projectService } from "@/lib/services/project.service";
import { Project } from "@/lib/models/project.model";

interface CanvasHydratorProps {
  project: Project;
}

export function CanvasHydrator({ project }: CanvasHydratorProps) {
  const { setElements, elements, setCanvasDimensions } = useCanvasStore();
  const isHydrated = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevSettingsRef = useRef<{ backgroundColor?: string; width?: number; height?: number } | null>(null);

  // 1. Hydrate store on mount
  useEffect(() => {
    const state = project.canvas_state;
    const settings = state?.settings || {};

    setCanvasDimensions(settings.width || 1920, settings.height || 1080);
    setElements(state?.elements || []);

    if (settings.backgroundColor) {
      useCanvasStore.getState().setCanvasBackgroundColor(settings.backgroundColor);
    }

    // Snapshot the initial settings so we preserve width/height on saves
    prevSettingsRef.current = {
      backgroundColor: settings.backgroundColor,
      width: settings.width,
      height: settings.height,
    };

    setTimeout(() => {
      isHydrated.current = true;
    }, 500);
  }, [project.id]);

  // 2. Subscribe to changes and debounced save
  useEffect(() => {
    const unsub = useCanvasStore.subscribe((state) => {
      if (!isHydrated.current) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
          try {
            // width/height are snapshotted on mount and never overwritten on save
            await projectService.updateProjectState(project.id, {
              elements: state.elements,
              settings: {
                backgroundColor: state.canvasBackgroundColor,
                width: prevSettingsRef.current?.width ?? 1920,
                height: prevSettingsRef.current?.height ?? 1080,
              },
            });
            console.log("Canvas saved securely to database.");
        } catch (err) {
          console.error("Failed to save canvas state:", err);
        }
      }, 1500);
    });

    return () => {
      unsub();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [project.id]);

  return null;
}
