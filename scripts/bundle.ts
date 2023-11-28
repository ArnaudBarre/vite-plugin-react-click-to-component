#!/usr/bin/env tnode
import { execSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { build, type BuildOptions, context } from "esbuild";

import packageJSON from "../package.json";

const dev = process.argv.includes("--dev");

rmSync("dist", { force: true, recursive: true });

const buildOrWatch = async (options: BuildOptions) => {
  if (!dev) return build(options);
  const ctx = await context(options);
  await ctx.watch();
  await ctx.rebuild();
};

await Promise.all([
  buildOrWatch({
    bundle: true,
    entryPoints: ["src/index.mts"],
    outfile: "dist/index.mjs",
    platform: "node",
    target: "node18",
    format: "esm",
    legalComments: "inline",
    external: Object.keys(packageJSON.peerDependencies),
  }),
  buildOrWatch({
    bundle: true,
    entryPoints: ["src/client.ts"],
    outfile: "dist/client.js",
    platform: "browser",
    format: "esm",
    target: "safari14",
    legalComments: "inline",
  }),
]).then(() => {
  execSync("cp LICENSE README.md src/index.cjs dist/");

  writeFileSync(
    "dist/index.d.mts",
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
        type: "module",
        main: "index.cjs",
        types: "index.d.mts",
        module: "index.mjs",
        exports: {
          ".": {
            types: "./index.d.mts",
            require: "./index.cjs",
            import: "./index.mjs",
          },
        },
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
