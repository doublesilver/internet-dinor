import { resolve } from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, "e2e/**"]
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
});
