#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  extractImports,
  isLocalSourceSpecifier,
  loadTsConfig,
  resolveImport,
} from "../module-graph.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "nino-enforcement-"));
const src = path.join(root, "src");
fs.mkdirSync(path.join(src, "UI", "atoms"), { recursive: true });
fs.mkdirSync(path.join(src, "states"), { recursive: true });
fs.writeFileSync(path.join(src, "states", "useSessionStore.ts"), "export const store = {};\n");
fs.writeFileSync(path.join(src, "UI", "atoms", "Button.tsx"), "export const Button = () => null;\n");
fs.writeFileSync(path.join(root, "tsconfig.app.json"), `{
  // TypeScript config files allow comments.
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@states/*": ["src/states/*"],
      "@atoms/*": ["src/UI/atoms/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}`);

const config = loadTsConfig(src);
const importer = path.join(src, "UI", "atoms", "Button.tsx");
assert.equal(resolveImport("@states/useSessionStore", importer, config), path.join(src, "states", "useSessionStore.ts"));
assert.equal(resolveImport("@atoms/Button", importer, config), importer);
assert.equal(resolveImport("@states/missing", importer, config), null);
assert.equal(isLocalSourceSpecifier("@states/useSessionStore", config), true);
assert.equal(isLocalSourceSpecifier("./Button.module.css", config), false);
assert.equal(isLocalSourceSpecifier("@styles/motion.module.css", config), false);
assert.equal(isLocalSourceSpecifier("@nino/ds/components/Button", config), false);

const imports = extractImports(`
  // import ignored from "./comment";
  const text = "import ignored from './string'";
  import {
    value,
  } from "@states/useSessionStore";
  export {
    value as other,
  } from "./other";
  export * from "./star";
  const z = require("./runtime");
  const lazy = import("./lazy");
  const meta = import.meta.url;
  const template = \`import ignored from "./template"\`;
`);

assert.deepEqual(imports.map(({ specifier }) => specifier), [
  "@states/useSessionStore",
  "./other",
  "./star",
  "./runtime",
  "./lazy",
]);

fs.rmSync(root, { recursive: true, force: true });
console.log("module-graph tests passed.");
