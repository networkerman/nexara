import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// xAura ships inside the OneXtel (Nexara) deployment under /xaura/.
// Production builds land in ../dist/xaura; dev keeps base "/" on its own port.
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/xaura/" : "/",
  server: {
    host: "::",
    port: 8081,
  },
  build: {
    outDir: "../dist/xaura",
    emptyOutDir: true,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
