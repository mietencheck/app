import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import tsconfigPaths from "vite-tsconfig-paths";

const IS_DEV = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [
    topLevelAwait(),
    tsconfigPaths() as never,
    react(),
    sentryVitePlugin({
      org: "mietenbremse",
      project: "web",
      disable: IS_DEV,
    }),
  ],

  worker: {
    plugins: () => [topLevelAwait()],
  },

  optimizeDeps: {
    exclude: IS_DEV ? ["flow-machine"] : [],
  },

  build: {
    sourcemap: true,
  },
});
