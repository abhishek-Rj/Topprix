import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
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
