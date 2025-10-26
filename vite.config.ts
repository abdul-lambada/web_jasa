import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const BASE = process.env.VITE_BASE || '/';
  const apiRewrite = (p: string) => p.replace(/^\/api/, `${BASE.replace(/\/$/, '')}/api`);
  return ({
  base: BASE,
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        rewrite: apiRewrite,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
});
