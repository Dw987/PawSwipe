import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/PawSwipe",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    outDir: "dist",
  },
});
