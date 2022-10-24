import { defineConfig } from "vite";
import { swcReactRefresh } from "vite-plugin-swc-react-refresh";
import { reactClickToComponent } from "../dist";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [swcReactRefresh(), reactClickToComponent()],
  server: { open: true },
});
