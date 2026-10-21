#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { readStdin, textWrittenBy } from "./hook-kit.mjs";

const checker = path.resolve(
  new URL("../enforcement/check-architecture-boundaries.mjs", import.meta.url).pathname,
);
const input = JSON.parse((await readStdin()) || "{}");
const targetFile = input.tool_input?.file_path;
if (!targetFile?.includes("/apps/manager/src/") || !/\.tsx?$/.test(targetFile)) process.exit(0);
// An Edit that writes no import cannot introduce a boundary violation.
const written = textWrittenBy(input.tool_name, input.tool_input) ?? "";
if (input.tool_name === "Edit" && !/\bimport\b|\bfrom\s+['"]|\brequire\(/.test(written)) process.exit(0);

const projectRoot = path.resolve(process.cwd(), "apps/manager/src");
const policy = new URL("../enforcement/architecture-boundaries.json", import.meta.url).pathname;

const result = spawnSync(process.execPath, [checker, projectRoot, policy, targetFile], {
  stdio: "inherit",
});

if (result.error) {
  console.error(`Failed to execute architecture enforcement: ${result.error.message}`);
  process.exit(2);
}

process.exit(result.status ?? 2);
