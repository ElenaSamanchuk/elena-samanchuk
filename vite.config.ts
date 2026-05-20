import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base =
    env.VITE_BASE_PATH || (mode === "production" ? "/tochka-site-marketer-new/" : "/");

  return {
    base,
    server: {
      port: 5173,
    },
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
  };
});
