import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FirebaseProvider } from "./context/firebaseProvider.tsx";
import "./index.css";
import App from "./App.tsx";
import "./lib/i18n.ts";

createRoot(document.getElementById("root")!).render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
);
