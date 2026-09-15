import "./global.css";

import React from "react";
import {
  FlowUIProvider,
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

export default function App() {
  return (
    <FlowUIProvider theme={theme} initialMode="system">
      <HomeScreen />
    </FlowUIProvider>
  );
}
