import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { reactClickToComponent } from "../dist";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), reactClickToComponent()],
  server: { open: true },
});
