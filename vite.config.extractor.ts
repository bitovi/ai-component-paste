// vite.config.extractor.ts
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/extractor/index.ts"),
      name: "extractor",
      fileName: () => "index.js",
      formats: ["es"],
    },
    outDir: "dist/extractor",
    emptyOutDir: false,
  },
  plugins: [
    dts({
      outDir: "dist",
    }),
  ],
});
