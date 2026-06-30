import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isLibraryBuild = command === "build" && !process.env.VITEST;

  return {
    // tailwindcss() only matters for the playground (and Vitest's jsdom CSS handling) —
    // the library build ships plain className strings; consumers run their own Tailwind
    // pipeline over Button's source once it's actually installed as a dependency.
    plugins: isLibraryBuild ? [react()] : [react(), tailwindcss()],
    // `yarn dev` serves the playground; `yarn build`/`yarn test` use the project root.
    root: isLibraryBuild || process.env.VITEST ? undefined : "playground",
    build: isLibraryBuild
      ? {
          lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            formats: ["es"],
            fileName: "index",
          },
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
          },
        }
      : undefined,
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      css: true,
      restoreMocks: true,
    },
  };
});
