import { readFileSync } from "fs";
import { join } from "path";
import { PluginOption } from "vite";

export const reactClickToComponent = (): PluginOption => ({
  name: "react-click-to-component",
  apply: "serve",
  transformIndexHtml: () => [
    {
      tag: "script",
      attrs: { type: "module" },
      children: readFileSync(join(__dirname, "client.js"), "utf-8"),
    },
  ],
});
