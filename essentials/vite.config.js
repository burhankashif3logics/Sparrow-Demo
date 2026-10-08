import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  /* A fixed port of its own, so both builds can run side by side in a demo. */
  server: { port: 5190 },
  preview: { port: 5191 },
});
