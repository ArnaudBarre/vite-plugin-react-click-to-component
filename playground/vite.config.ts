import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { reactClickToComponent } from "../dist/index.mjs";

// eslint-disable-next-line @arnaud-barre/no-default-export
export default defineConfig({
  plugins: [react(), reactClickToComponent()],
  server: { open: true },
});
