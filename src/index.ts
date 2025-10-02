import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PluginOption } from "vite";

let root = "";
let base = "";

export const reactClickToComponent = (): PluginOption => ({
  name: "react-click-to-component",
  apply: "serve",
  configResolved(config) {
    root = config.root;
    base = config.base;
  },
  transformIndexHtml: () => [
    {
      tag: "script",
      attrs: { type: "module" },
      children: readFileSync(join(import.meta.dirname, "client.js"), "utf-8")
        .replace("__ROOT__", root)
        .replace("__BASE__", base),
    },
  ],
  transform: {
    filter: { id: /jsx-dev-runtime\.js/u },
    handler(code) {
      if (code.includes("_source")) return; // React <19, no hack needed
      // React 19, inject source into _debugInfo
      const defineIndex = code.indexOf('"_debugInfo"');
      if (defineIndex === -1) return;
      const valueIndex = code.indexOf("value: null", defineIndex);
      if (valueIndex === -1) return;
      let newCode =
        code.slice(0, valueIndex)
        + "value: source"
        + code.slice(valueIndex + 11);
      if (code.includes("function ReactElement(type, key, self, source,")) {
        return newCode;
      }
      // React 19.2: we need to inject source jsxDEV -> jsxDEVImpl -> ReactElement
      newCode = newCode.replaceAll(
        /maybeKey,\s*isStaticChildren/gu,
        "maybeKey, isStaticChildren, source",
      );
      newCode = newCode.replaceAll(
        /(\w+)?,\s*debugStack,\s*debugTask/gu,
        (m, previousArg) => {
          if (previousArg === "source") return m;
          return m.replace("debugTask", "debugTask, source");
        },
      );
      return newCode;
    },
  },
});
