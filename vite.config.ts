import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, type Plugin } from "vite";

const GZIP_EXTENSIONS = /\.(js|mjs|cjs|css|html|json|svg|webp|ico)$/i;
/** Skip tiny files; HTML entry is often ~1kB and still benefits from `gzip_static`. */
const GZIP_MIN_BYTES = 256;

/** Emit precompressed `.gz` siblings for static hosts that support `gzip_static` / equivalent. */
function gzipStaticAssets(): Plugin {
  let outRoot = "";

  return {
    name: "gzip-static-assets",
    apply: "build",
    configResolved(config) {
      outRoot = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(full);
            continue;
          }
          if (!GZIP_EXTENSIONS.test(entry.name) || entry.name.endsWith(".gz")) {
            continue;
          }
          const source = readFileSync(full);
          if (source.length < GZIP_MIN_BYTES) {
            continue;
          }
          writeFileSync(`${full}.gz`, gzipSync(source, { level: 9 }));
        }
      };

      try {
        walk(outRoot);
      } catch {
        /* outDir missing or unreadable */
      }
    },
  };
}

export default defineConfig(async () => ({
  plugins: [
    await babel({
      presets: [reactCompilerPreset()],
      // Faster transforms; Vite/Rolldown already handle source maps for the bundle.
      sourceMap: false,
    }),
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
    gzipStaticAssets(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
}));
