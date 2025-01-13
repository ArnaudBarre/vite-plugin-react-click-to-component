import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { PluginOption } from "vite";

let root = "";

export const reactClickToComponent = (): PluginOption => ({
  name: "react-click-to-component",
  apply: "serve",
  configResolved(config) {
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
  transform(code, id) {
    if (!id.includes("jsx-dev-runtime.js")) return;
    if (code.includes("_source")) return;
    const defineIndex = code.indexOf('"_debugInfo"');
    if (defineIndex === -1) return;
    const valueIndex = code.indexOf("value: null", defineIndex);
    if (valueIndex === -1) return;
    return (
      code.slice(0, valueIndex) + "value: source" + code.slice(valueIndex + 11)
    );
  },
});
