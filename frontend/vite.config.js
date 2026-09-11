import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// Defaults to the backend running on the host (plain `npm run dev`).
// Inside the dev Docker Compose network, this is overridden to
// http://backend:8000 since containers reach each other by service name.
const proxyTarget = process.env.VITE_PROXY_TARGET || "http://localhost:8000";

export default defineConfig(({ mode }) => {
  // One shared .env at the project root instead of a per-service copy.
  // In Docker, VITE_API_KEY already arrives as a real build arg / env var
  // (see Dockerfile and docker-compose.*.yml), so this is only needed for
  // `npm run dev` on the host, where we read the backend's API_KEY
  // straight out of the root .env and expose it under the VITE_ name the
  // client code expects.
  const rootEnv = loadEnv(mode, path.resolve(__dirname, ".."), "");

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        "/api": proxyTarget,
      },
    },
    define: {
      "import.meta.env.VITE_API_KEY": JSON.stringify(
        process.env.VITE_API_KEY || rootEnv.API_KEY || "",
      ),
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        process.env.VITE_API_BASE_URL || "/api",
      ),
    },
  };
});
