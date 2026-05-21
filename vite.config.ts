import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import {
  defaultProductionBase,
  defaultProductionSiteUrl,
  seoInjectPlugin,
} from "./vite.seoPlugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_PATH || (mode === "production" ? defaultProductionBase() : "/");
  const siteUrl =
    env.VITE_SITE_URL || (mode === "production" ? defaultProductionSiteUrl(base) : "http://localhost:5173/");

  return {
    base,
    plugins: [tailwindcss(), seoInjectPlugin({ siteUrl, basePath: base })],
    server: {
      port: 5173,
    },
    build: {
      target: "es2022",
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/motion")) return "motion";
            if (id.includes("node_modules/lenis")) return "lenis";
          },
        },
      },
    },
  };
});
