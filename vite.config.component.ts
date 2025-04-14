// vite.config.component.ts
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/component/index.ts"),
      name: "component",
      fileName: () => "index.js",
      formats: ["es"],
    },
    outDir: "dist/component",
  },
  plugins: [
    dts({
      outDir: "dist",
    }),
  ],
});
