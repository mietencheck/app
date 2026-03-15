import { fileURLToPath, URL } from "node:url";

import { cloudflare } from "@cloudflare/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";

const IS_DEV = process.env.NODE_ENV === "development";
const IS_TEST =
  process.env.VITEST === "true" ||
  process.argv.some((arg) => arg.includes("vitest"));

export default defineConfig({
  plugins: [
    !IS_TEST && cloudflare(),
    react(),
    !IS_TEST &&
      sentryVitePlugin({
        org: "mietenbremse",
        project: "web",
        disable: IS_DEV,
      }),
  ].filter(Boolean) as PluginOption[],

  optimizeDeps: {
    exclude: IS_DEV ? ["flow-machine"] : [],
  },

  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
    tsconfigPaths: true,
  },

  build: {
    sourcemap: true,
  },
});
