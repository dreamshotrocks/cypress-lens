import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "",
  plugins: [react()],
  build: {
    outDir: "build/",
    rollupOptions: {
      output: {
        entryFileNames: "static/js/main.js",
        assetFileNames: "static/css/main.css",
      },
    },
  },
});
