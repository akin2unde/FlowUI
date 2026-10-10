import React from "react";
import ReactDOM from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@akin2unde/flowui-react/styles.css";
import { App } from "./App";
import { DocsApp } from "./DocsApp";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Documentation />
  </React.StrictMode>,
);

function Documentation() {
  const [gallery, setGallery] = React.useState(location.hash === "#gallery");
  React.useEffect(() => {
    const update = () => setGallery(location.hash === "#gallery");
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return gallery ? (
    <>
      <a href="#/react/AsyncLabel" style={{ display: "block", padding: 16 }}>
        ← Documentation
      </a>
      <App />
    </>
  ) : (
    <DocsApp />
  );
}
