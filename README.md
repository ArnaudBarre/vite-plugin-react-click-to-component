# vite-plugin-react-click-to-component [![npm](https://img.shields.io/npm/v/vite-plugin-react-click-to-component)](https://www.npmjs.com/package/vite-plugin-react-click-to-component)

Option+Click React components in your browser to open the source in your editor.

Light version of [ericclemmons/click-to-component](https://github.com/ericclemmons/click-to-component) that uses Vite's launch editor middleware to open the source code in your currently running editor.

## Installation

```sh
npm i -D vite-plugin-react-click-to-component
```

In your Vite config:

```ts
import { defineConfig } from "vite";
import { swcReactRefresh } from "vite-plugin-swc-react-refresh"; // or @vitejs/plugin-react
import { reactClickToComponent } from "vite-plugin-react-click-to-component";

export default defineConfig({
  plugins: [swcReactRefresh(), reactClickToComponent()],
});
```
