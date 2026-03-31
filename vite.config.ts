import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins:.filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./features"), // features klasörüne yönlendirildi
    },
  },
}));