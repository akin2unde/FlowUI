import "./global.css";

import React from "react";
import {
  FlowUIProvider,
  AsyncLabelProvider,
  type LabelLookup,
  createNativeTheme,
} from "@akin2unde/flowui-react-native";
import { HomeScreen } from "./src/HomeScreen";

const theme = createNativeTheme({
  schemes: {
    light: { primary: "#7c3aed" },
    dark: { primary: "#a78bfa" },
  },
  components: {
    buttonHeight: 52,
    inputHeight: 52,
    controlRadius: 14,
  },
});

const lookups: Record<string, LabelLookup> = {
  customerName: {
    resolve: async (codes, { signal }) => {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 650);
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timer);
            reject(signal.reason);
          },
          { once: true },
        );
      });
      const names: Record<string, string> = {
        CUS001: "Akintunde",
        CUS002: "Mary",
      };
      return Object.fromEntries(
        codes.map((code) => [code, names[code] ?? null]),
      );
    },
  },
};
export default function App() {
  return (
    <FlowUIProvider theme={theme} initialMode="system">
      <AsyncLabelProvider lookups={lookups} scopeKey="native-demo">
        <HomeScreen />
      </AsyncLabelProvider>
    </FlowUIProvider>
  );
}
