import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { PluginOption } from "vite";

let root = "";

export const reactClickToComponent = (): PluginOption => ({
  name: "react-click-to-component",
  apply: "serve",
  configResolved: (config) => {
    root = config.root;
  },
  transformIndexHtml: () => [
    {
      tag: "script",
      attrs: { type: "module" },
      children: readFileSync(
        join(dirname(fileURLToPath(import.meta.url)), "client.js"),
        "utf-8",
      ).replace("__ROOT__", root),
    },
  ],
});
