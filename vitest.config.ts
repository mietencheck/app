import type { UserConfig } from "vite";
import { configDefaults } from "vitest/config";

import viteConfig from "./vite.config";

const config: UserConfig & { test: { exclude: string[] } } = {
  ...viteConfig,
  test: { exclude: [...configDefaults.exclude, "e2e/**"] },
};

export default config;
