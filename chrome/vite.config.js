import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const indexHtml = fileURLToPath(new URL("./index.html", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: indexHtml,
      },
    },
    outDir: "dist",
  },
});
