#!/usr/bin/env tnode
import { rmSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { build } from "esbuild";

import * as packageJSON from "../package.json";

const dev = process.argv.includes("--dev");

rmSync("dist", { force: true, recursive: true });

Promise.all([
  build({
    bundle: true,
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    platform: "node",
    target: "node14",
    legalComments: "inline",
    external: Object.keys(packageJSON.peerDependencies),
    watch: dev,
  }),
  build({
    bundle: true,
    entryPoints: ["src/client.ts"],
    outdir: "dist",
    platform: "browser",
    format: "esm",
    target: "safari13",
    legalComments: "inline",
    watch: dev,
  }),
]).then(() => {
  execSync("cp LICENSE README.md dist/");

  writeFileSync(
    "dist/index.d.ts",
    `import { PluginOption } from "vite";
export declare const reactClickToComponent: () => PluginOption;
`,
  );

  writeFileSync(
    "dist/package.json",
    JSON.stringify(
      {
        name: packageJSON.name,
        description:
          "Option+Right Click in your browser to open the source in your editor",
        version: packageJSON.version,
        author: "Arnaud Barré (https://github.com/ArnaudBarre)",
        license: packageJSON.license,
        repository: "github:ArnaudBarre/vite-plugin-react-click-to-component",
        main: "index.js",
        keywords: [
          "vite",
          "vite-plugin",
          "react",
          "inspector",
          "click-to-component",
        ],
        peerDependencies: packageJSON.peerDependencies,
      },
      null,
      2,
    ),
  );
});
