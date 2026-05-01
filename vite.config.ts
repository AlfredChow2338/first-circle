import path from "node:path";

import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    VitePWA({
      srcDir: "src",
      filename: "service-worker.ts",
      strategies: "injectManifest",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,webp,ico}"],
      },
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
});
