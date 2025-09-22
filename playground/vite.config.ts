import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactClickToComponent } from "../dist/index.js";
import restart from "vite-plugin-restart";

export default defineConfig({
  plugins: [
    react(),
    reactClickToComponent(),
    restart({ restart: ["../dist/client.js", "../dist/index.js"] }),
  ],
  server: { open: true },
});
