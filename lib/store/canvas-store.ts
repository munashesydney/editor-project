"use client";

import { create } from "zustand";
import {
  CanvasElement,
  AIMessage,
  ElementType,
  ShapeKind,
} from "../types/canvas";
import { createElement, generateId } from "../services/canvas-service";

const SEED_MESSAGES: AIMessage[] = [
  {
    id: "seed-1",
    role: "assistant",
    content:
      "I'm your design assistant. Describe what you want to build and I'll add it to the canvas.",
    timestamp: new Date(),
  },
  {
    id: "seed-2",
    role: "user",
    content: "Add a title saying Welcome to my design",
    timestamp: new Date(),
  },
  {
    id: "seed-3",
    role: "assistant",
    content:
      "Done — I've placed a heading on your canvas. You can drag it wherever you like.",
    timestamp: new Date(),
  },
  {
    id: "seed-4",
    role: "user",
    content: "Add a blue rectangle below it",
    timestamp: new Date(),
  },
  {
    id: "seed-5",
    role: "assistant",
    content:
      "Added a blue shape. Try double-clicking a text element to edit its content.",
    timestamp: new Date(),
  },
];

interface CanvasStore {
  elements: CanvasElement[];
  selectedId: string | null;
  activeTool: "select" | "image" | "text" | "shape";
  activeShapeKind: ShapeKind;
  customPathData: string;
  activePanel: "text" | "shape" | null;
  messages: AIMessage[];

  addElement: (type: ElementType, position?: { x: number; y: number }) => void;
  addImage: (
    src: string,
    position?: { x: number; y: number },
    dimensions?: { width: number; height: number },
  ) => void;
  addElements: (elements: CanvasElement[]) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  deselectAll: () => void;
  setActiveTool: (tool: "select" | "image" | "text" | "shape") => void;
  setActiveShapeKind: (kind: ShapeKind) => void;
  setCustomPathData: (path: string) => void;
  setActivePanel: (panel: "text" | "shape" | null) => void;
  addMessage: (role: "user" | "assistant", content: string) => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  elements: [],
  selectedId: null,
  activeTool: "select",
  activeShapeKind: "rectangle",
  customPathData: "",
  activePanel: null,
  messages: SEED_MESSAGES,

  addElement: (type, position) => {
    const shapeKind = type === "shape" ? get().activeShapeKind : undefined;
    const pathData =
      type === "shape" && shapeKind === "custom"
        ? get().customPathData
        : undefined;
    const element = createElement(
      type,
      position || { x: 100, y: 100 },
      undefined,
      shapeKind,
      pathData,
    );
    set((state) => ({
      elements: [...state.elements, element],
      selectedId: element.id,
      activeTool: "select",
      customPathData: "",
    }));
  },

  addImage: (src, position, dimensions) => {
    const id = generateId();
    const element: CanvasElement = {
      id,
      type: "image",
      position: position || { x: 100, y: 100 },
      dimensions: dimensions || { width: 200, height: 200 },
      style: {
        src,
        backgroundColor: "transparent",
      },
    };
    set((state) => ({
      elements: [...state.elements, element],
      selectedId: element.id,
      activeTool: "select",
    }));
  },

  addElements: (newElements) => {
    set((state) => ({
      elements: [...state.elements, ...newElements],
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el,
      ),
    }));
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      activePanel: state.selectedId === id ? null : state.activePanel,
    }));
  },

  selectElement: (id) => {
    set((state) => ({
      selectedId: id,
      activePanel: state.selectedId !== id ? null : state.activePanel,
      elements: state.elements.map((el) => ({
        ...el,
        selected: el.id === id,
      })),
    }));
  },

  deselectAll: () => {
    set((state) => ({
      selectedId: null,
      activePanel: null,
      elements: state.elements.map((el) => ({ ...el, selected: false })),
    }));
  },

  setActiveTool: (tool) => {
    set({ activeTool: tool });
  },

  setActiveShapeKind: (kind) => {
    set({ activeShapeKind: kind });
  },

  setCustomPathData: (path) => {
    set({ customPathData: path });
  },

  setActivePanel: (panel) => {
    set({ activePanel: panel });
  },

  addMessage: (role, content) => {
    const message: AIMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
