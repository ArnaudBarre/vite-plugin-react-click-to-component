# Changelog

## 3.0.1

- Add vite@6 to peer dependency ranges

## 3.0.0

- Add vite@5 to peer dependency ranges
- Switch plugin to ESM. This removes the CJS warning when using the plugin with Vite 5. A CJS wrapper is still provided but [migrating](https://vitejs.dev/guide/migration.html#deprecate-cjs-node-api) to running Vite in ESM is encouraged
- Drop support for Vite 2 & 3 & node<18 (aligns with Vite 5)

## 2.0.0

Context menu on option+right click to see all the intermediate components and jump to the right place!
Direct click is removed for two reasons:

- It doesn't play well with buttons and links
- In large apps, you often end up on the generic component instead of going inside the usage of it

## 1.0.3

- Add Vite 4 to peer dependency range
- Don't show outline for non-clickable targets
- Use debug log when no React instance was found

## 1.0.1

Fix tooltip position for elements on the right side of the screen

## 1.0.0

Initial release
