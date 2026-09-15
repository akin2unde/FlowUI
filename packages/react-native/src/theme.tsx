import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";
import type { FlowThemeMode } from "./types";

export interface NativeColorScheme {
  canvas: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  success: string;
  warning: string;
  danger: string;
  overlay: string;
}

export interface NativeFlowTheme {
  schemes: {
    light: NativeColorScheme;
    dark: NativeColorScheme;
  };
  spacing: Record<"xs" | "sm" | "md" | "lg" | "xl", number>;
  radius: Record<"none" | "sm" | "md" | "lg" | "xl" | "full", number>;
  components: {
    buttonHeight: number;
    inputHeight: number;
    controlRadius: number;
  };
}

export type NativeThemeOverride = {
  schemes?: {
    light?: Partial<NativeColorScheme>;
    dark?: Partial<NativeColorScheme>;
  };
  spacing?: Partial<NativeFlowTheme["spacing"]>;
  radius?: Partial<NativeFlowTheme["radius"]>;
  components?: Partial<NativeFlowTheme["components"]>;
};

export const defaultNativeTheme: NativeFlowTheme = {
  schemes: {
    light: {
      canvas: "#f8fafc",
      surface: "#ffffff",
      surfaceRaised: "#ffffff",
      text: "#0f172a",
      textMuted: "#64748b",
      border: "#e2e8f0",
      primary: "#2563eb",
      primaryText: "#ffffff",
      success: "#16a34a",
      warning: "#d97706",
      danger: "#dc2626",
      overlay: "rgba(15,23,42,.55)",
    },
    dark: {
      canvas: "#020617",
      surface: "#0f172a",
      surfaceRaised: "#1e293b",
      text: "#f8fafc",
      textMuted: "#94a3b8",
      border: "#334155",
      primary: "#60a5fa",
      primaryText: "#0f172a",
      success: "#22c55e",
      warning: "#f59e0b",
      danger: "#ef4444",
      overlay: "rgba(0,0,0,.72)",
    },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  components: { buttonHeight: 48, inputHeight: 50, controlRadius: 12 },
};

export function createNativeTheme(
  override: NativeThemeOverride = {},
): NativeFlowTheme {
  return {
    schemes: {
      light: {
        ...defaultNativeTheme.schemes.light,
        ...override.schemes?.light,
      },
      dark: {
        ...defaultNativeTheme.schemes.dark,
        ...override.schemes?.dark,
      },
    },
    spacing: { ...defaultNativeTheme.spacing, ...override.spacing },
    radius: { ...defaultNativeTheme.radius, ...override.radius },
    components: {
      ...defaultNativeTheme.components,
      ...override.components,
    },
  };
}

interface ThemeContextValue {
  theme: NativeFlowTheme;
  colors: NativeColorScheme;
  mode: FlowThemeMode;
  resolvedMode: "light" | "dark";
  setMode: (mode: FlowThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface FlowUIProviderProps extends PropsWithChildren {
  theme?: NativeFlowTheme;
  initialMode?: FlowThemeMode;
}

export function FlowUIProvider({
  children,
  theme = defaultNativeTheme,
  initialMode = "system",
}: FlowUIProviderProps) {
  const systemMode = useColorScheme();
  const [mode, setMode] = useState<FlowThemeMode>(initialMode);
  const resolvedMode = mode === "system" ? (systemMode ?? "light") : mode;
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: theme.schemes[resolvedMode],
      mode,
      resolvedMode,
      setMode,
    }),
    [mode, resolvedMode, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useFlowUITheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useFlowUITheme must be used inside FlowUIProvider.");
  }
  return value;
}
