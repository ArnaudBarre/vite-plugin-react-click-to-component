import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { reactClickToComponent } from "../dist/index.mjs";

export default defineConfig({
  plugins: [react(), reactClickToComponent()],
  server: { open: true },
});
