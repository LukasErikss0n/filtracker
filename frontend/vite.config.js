import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Defaults to the backend running on the host (plain `npm run dev`).
// Inside the dev Docker Compose network, this is overridden to
// http://backend:8000 since containers reach each other by service name.
const proxyTarget = process.env.VITE_PROXY_TARGET || "http://localhost:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": proxyTarget,
    },
  },
});
