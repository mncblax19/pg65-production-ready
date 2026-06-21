import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Dev server (npm run dev)
  server: {
    host: true, // 0.0.0.0
    port: 5173,
    allowedHosts: [
      ".ngrok-free.app",
      "localhost",
      "https://pg-65.com",
      "https://www.pg-65.com",
      "*",
    ],
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ["*", "https://pg-65.com", "https://www.pg-65.com"],
  },
});
