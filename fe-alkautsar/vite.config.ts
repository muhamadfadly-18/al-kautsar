import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const proxyTarget =
    env.VITE_API_PROXY_TARGET ||
    env.VITE_API_BASE_URL ||
    env.VITE_API_URL ||
    "";

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
      port: Number(env.VITE_PORT) || 5173,
      proxy: proxyTarget
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              secure: true,
              headers: {
                "ngrok-skip-browser-warning": "true",
              },
            },
          }
        : undefined,
    },
  };
});
