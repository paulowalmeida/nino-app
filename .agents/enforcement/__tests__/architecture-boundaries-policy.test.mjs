#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "nino-boundaries-"));
const src = path.join(root, "src");
fs.mkdirSync(path.join(src, "UI", "atoms"), { recursive: true });
fs.mkdirSync(path.join(src, "states"), { recursive: true });
fs.mkdirSync(path.join(src, "hooks", "ui"), { recursive: true });
fs.mkdirSync(path.join(src, "hooks", "order"), { recursive: true });
fs.writeFileSync(path.join(src, "states", "store.ts"), "export const state = {};\n");
fs.writeFileSync(path.join(src, "hooks", "ui", "useDisclosure.ts"), "export const useDisclosure = () => false;\n");
fs.writeFileSync(path.join(src, "hooks", "order", "useOrders.ts"), "export const useOrders = () => [];\n");
fs.writeFileSync(path.join(src, "UI", "atoms", "Button.tsx"), "import { state } from \"../../states/store\"; export const Button = () => state;\n");
fs.writeFileSync(path.join(root, "tsconfig.json"), JSON.stringify({ compilerOptions: { baseUrl: "." } }));

const checker = path.resolve("enforcement/check-architecture-boundaries.mjs");
const policy = path.join(root, "policy.json");
fs.writeFileSync(policy, JSON.stringify({
  rules: [{
    id: "presentation-cannot-import-state",
    severity: "block",
    mode: "transitive",
    sourceDirectories: ["UI/atoms"],
    targetDirectories: ["states"],
    message: "state access is forbidden",
  }],
}));

let result = spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
assert.equal(result.status, 1);

fs.writeFileSync(policy, JSON.stringify({
  rules: [{
    id: "presentation-cannot-import-state",
    severity: "warning",
    mode: "transitive",
    sourceDirectories: ["UI/atoms"],
    targetDirectories: ["states"],
  }],
}));
result = spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
assert.equal(result.status, 0);

fs.writeFileSync(path.join(src, "UI", "atoms", "Button.tsx"), "import { useDisclosure } from \"../../hooks/ui/useDisclosure\"; export const Button = () => useDisclosure();\n");
fs.writeFileSync(policy, JSON.stringify({
  rules: [{
    id: "presentation-cannot-import-domain-hooks",
    severity: "block",
    mode: "transitive",
    sourceDirectories: ["UI/atoms"],
    targetDirectories: ["hooks"],
    excludedTargetDirectories: ["hooks/ui"],
  }],
}));
result = spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
assert.equal(result.status, 0, "Excluded presentation hooks must remain allowed.");

fs.writeFileSync(path.join(src, "UI", "atoms", "Button.tsx"), "import { useOrders } from \"../../hooks/order/useOrders\"; export const Button = () => useOrders();\n");
result = spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
assert.equal(result.status, 1, "Non-excluded domain hooks must remain blocked.");

fs.writeFileSync(policy, JSON.stringify({
  rules: [{
    id: "invalid-exclusions",
    severity: "block",
    mode: "direct",
    sourceDirectories: ["UI/atoms"],
    targetDirectories: ["hooks"],
    excludedTargetDirectories: "hooks/ui",
  }],
}));
result = spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
assert.equal(result.status, 2, "Invalid excludedTargetDirectories policy must fail closed.");

fs.rmSync(root, { recursive: true, force: true });
console.log("architecture boundary policy tests passed.");
