#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "nino-boundaries-"));
const src = path.join(root, "src");
const enforcement = path.resolve(new URL("..", import.meta.url).pathname);
const checker = path.join(enforcement, "check-architecture-boundaries.mjs");
const policy = path.join(enforcement, "architecture-boundaries.json");

function write(relativePath, content) {
  const file = path.join(src, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function run() {
  return spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
}

try {
  fs.writeFileSync(path.join(root, "tsconfig.app.json"), JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["src/*"] } } }));
  write("shared/services/http.service.ts", "export const api = {};");
  write("pages/catalog/hooks/useCatalog/useCatalog.ts", "export const useCatalog = () => [];");
  write("pages/catalog/facades/useCatalogFacade/useCatalogFacade.ts", 'import { useCatalog } from "../../hooks/useCatalog/useCatalog"; export const useCatalogFacade = useCatalog;');
  write("pages/catalog/components/CatalogList/CatalogList.tsx", 'import { useCatalogFacade } from "../../facades/useCatalogFacade/useCatalogFacade"; export const CatalogList = useCatalogFacade;');
  write("pages/catalog/Catalog.tsx", 'import { CatalogList } from "./components/CatalogList/CatalogList"; export const Catalog = CatalogList;');
  assert.equal(run().status, 0, "The canonical facade flow must pass.");

  write("pages/catalog/components/CatalogList/CatalogList.tsx", 'import { api } from "@/shared/services/http.service"; export const CatalogList = api;');
  assert.equal(run().status, 1, "A component bypassing the facade must fail.");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log("Architecture boundary integration tests passed.");
