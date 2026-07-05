import {
  ElementStyle,
  TextAlign,
  FontStyle,
  TextDecoration,
} from "../types/canvas";

export interface FontOption {
  label: string;
  value: string;
}

export const FONT_FAMILIES: FontOption[] = [
  { label: "Inter", value: "Inter, sans-serif" },
  {
    label: "System UI",
    value: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Courier New", value: '"Courier New", Courier, monospace' },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "SF Mono", value: '"SF Mono", "SFMono-Regular", monospace' },
  { label: "Playfair Display", value: '"Playfair Display", Georgia, serif' },
  { label: "Roboto", value: "Roboto, sans-serif" },
];

export const FONT_SIZES = [
  10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72,
];

export const TEXT_ALIGN_OPTIONS: {
  label: string;
  value: TextAlign;
  icon: string;
}[] = [
  { label: "Left", value: "left", icon: "align-left" },
  { label: "Center", value: "center", icon: "align-center" },
  { label: "Right", value: "right", icon: "align-right" },
];

export function createDefaultTextStyle(): ElementStyle {
  return {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    color: "#1f2937",
    backgroundColor: "transparent",
  };
}

export function getFontFamilyLabel(value: string): string {
  const match = FONT_FAMILIES.find((f) => f.value === value);
  return match?.label ?? value;
}

export function buildTextStyleInline(
  style: ElementStyle,
): Record<string, string | number | undefined> {
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    textAlign: style.textAlign,
    color: style.color,
    backgroundColor: style.backgroundColor,
  };
}
