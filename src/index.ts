import { readFileSync } from "fs";
import { join } from "path";
import { PluginOption } from "vite";

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
      children: readFileSync(join(__dirname, "client.js"), "utf-8").replace(
        "__ROOT__",
        root,
      ),
    },
  ],
});
