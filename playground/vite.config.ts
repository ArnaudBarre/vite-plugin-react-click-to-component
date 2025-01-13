import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { reactClickToComponent } from "../dist/index.mjs";
import restart from "vite-plugin-restart";

export default defineConfig({
  plugins: [
    react(),
    reactClickToComponent(),
    restart({ restart: ["../dist/client.js", "../dist/index.mjs"] }),
  ],
  server: { open: true },
});
