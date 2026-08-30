import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from "react";
import {
  createTheme,
  defaultTheme,
  themeToCSS,
  type DeepPartial,
  type FlowUITheme,
  type ThemeMode,
} from "@akin2unde/flowui-core";

interface ThemeContextValue {
  theme: FlowUITheme;
  mode: ThemeMode;
}
const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  mode: "system",
});

export interface FlowUIProviderProps extends PropsWithChildren {
  theme?: FlowUITheme | DeepPartial<FlowUITheme>;
  mode?: ThemeMode;
}

export function FlowUIProvider({
  children,
  theme: suppliedTheme,
  mode = "system",
}: FlowUIProviderProps) {
  const theme = useMemo(
    () => createTheme(suppliedTheme as DeepPartial<FlowUITheme>),
    [suppliedTheme],
  );
  useEffect(() => {
    const id = "flowui-runtime-theme";
    let element = document.getElementById(id) as HTMLStyleElement | null;
    if (!element) {
      element = document.createElement("style");
      element.id = id;
      document.head.appendChild(element);
    }
    element.textContent = themeToCSS(theme, mode);
    document.documentElement.dataset.fuiTheme = mode;
  }, [theme, mode]);
  return (
    <ThemeContext.Provider value={{ theme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useFlowTheme = () => useContext(ThemeContext);
