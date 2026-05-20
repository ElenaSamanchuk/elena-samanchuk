import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("webglBg")) return "webgl";
        },
      },
    },
  },
});
