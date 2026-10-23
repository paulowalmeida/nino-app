#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "nino-boundaries-"));
const src = path.join(root, "src");
const checker = path.resolve("enforcement/check-architecture-boundaries.mjs");
const policy = path.join(root, "policy.json");

function write(relativePath, content) {
  const target = path.join(src, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function run() {
  return spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
}

try {
  fs.writeFileSync(path.join(root, "tsconfig.json"), JSON.stringify({ compilerOptions: { baseUrl: "." } }));
  write("pages/catalog/Catalog.tsx", 'import { service } from "../../services/catalog.service"; export const Catalog = service;');
  write("services/catalog.service.ts", "export const service = {};");

  fs.writeFileSync(policy, JSON.stringify({ rules: [{
    id: "pattern-rule", severity: "block", mode: "direct",
    sourcePatterns: ["^pages/.+\\.tsx$"], targetPatterns: ["^services/"],
  }] }));
  let result = run();
  assert.equal(result.status, 1, `${result.stderr}\n${result.stdout}`);

  fs.writeFileSync(policy, JSON.stringify({ rules: [{
    id: "pattern-warning", severity: "warning", mode: "direct",
    sourcePatterns: ["^pages/.+\\.tsx$"], targetPatterns: ["^services/"],
  }] }));
  result = run();
  assert.equal(result.status, 0, `${result.stderr}\n${result.stdout}`);

  write("pages/orders/Orders.tsx", "export const Orders = {};");
  write("pages/catalog/Catalog.tsx", 'import { Orders } from "../orders/Orders"; export const Catalog = Orders;');
  fs.writeFileSync(policy, JSON.stringify({ rules: [{
    id: "cross-domain", severity: "block", mode: "direct",
    sourceDirectories: ["pages"], disallowDifferentPageDomain: true,
  }] }));
  assert.equal(run().status, 1, "Different Page-domain dependencies must be detected.");

  write("pages/catalog/Catalog.tsx", 'import { helper } from "./helper"; export const Catalog = helper;');
  write("pages/catalog/helper.ts", "export const helper = {};");
  assert.equal(run().status, 0, "Dependencies inside the same Page domain must remain valid.");

  fs.writeFileSync(policy, JSON.stringify({ rules: [{
    id: "invalid", severity: "block", mode: "direct", sourcePatterns: ["^pages/"]
  }] }));
  assert.equal(run().status, 2, "A policy without a target selector must fail closed.");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log("Architecture boundary policy tests passed.");
