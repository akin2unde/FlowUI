# FlowUI for React

This guide is for browser React applications. The React package ships compiled CSS, so Tailwind is optional in the host application.

## Install

```bash
npm install @akin2unde/flowui-react @fortawesome/fontawesome-free
```

## Application entry

`src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "@akin2unde/flowui-react/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FlowUIProvider, createTheme } from "@akin2unde/flowui-react";
import { App } from "./App";

const theme = createTheme({
  palette: {
    primary: {
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FlowUIProvider theme={theme} mode="system">
      <App />
    </FlowUIProvider>
  </React.StrictMode>,
);
```

## App and first screen

`src/App.tsx`:

```tsx
import { HomeScreen } from "./screens/HomeScreen";

export function App() {
  return <HomeScreen />;
}
```

`src/screens/HomeScreen.tsx`:

```tsx
import { Button, Card, Input, VC } from "@akin2unde/flowui-react";

export function HomeScreen() {
  return (
    <VC gap="md" padding="lg" maxWidth={640} marginX="auto">
      <Card>
        <h1>FlowUI React</h1>
        <Input placeholder="Product name" />
        <Button>Save product</Button>
      </Card>
    </VC>
  );
}
```

## Host Tailwind

You may install Tailwind in the React application for page-specific styling. It does not replace FlowUI’s shipped stylesheet and it does not need to scan FlowUI’s package.

See [Component API](COMPONENT-API.md) for the complete browser component reference.
