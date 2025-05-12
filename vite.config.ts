import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],
    base: "/", // Ensures correct asset paths on Vercel
    build: {
        outDir: "dist", // Default is "dist", but explicitly defining it
        emptyOutDir: true, // Cleans old files before building
    },
    server: {
        host: true,
        port: 5173,
    },
});
