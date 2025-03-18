import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FirebaseProvider } from "./context/firebaseProvider.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <FirebaseProvider>
            <App />
        </FirebaseProvider>
    </StrictMode>
);
