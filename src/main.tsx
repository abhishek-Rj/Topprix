import { createRoot } from "react-dom/client";
import { FirebaseProvider } from "./context/firebaseProvider.tsx";
import "./index.css";
import App from "./App.tsx";
import "./lib/i18n.ts";
import ToastCont from "./components/ToastCont.tsx";

createRoot(document.getElementById("root")!).render(
  <FirebaseProvider>
    <ToastCont />
    <App />
  </FirebaseProvider>
);
