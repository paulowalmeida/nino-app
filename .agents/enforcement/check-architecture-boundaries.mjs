#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  extractImports,
  isLocalSourceSpecifier,
  lineAt,
  loadTsConfig,
  resolveImport,
  SOURCE_EXTENSIONS,
} from "./module-graph.mjs";

const root = process.argv[2];
const policyFile = process.argv[3] ?? new URL("./architecture-boundaries.json", import.meta.url).pathname;
const targetFile = process.argv[4] ? path.resolve(process.argv[4]) : null;

if (!root) {
  console.error("Usage: node enforcement/check-architecture-boundaries.mjs <project-src-root> [policy-file]");
  process.exit(2);
}

const sourceRoot = path.resolve(root);
if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
  console.error(`Source root does not exist or is not a directory: ${sourceRoot}`);
  process.exit(2);
}

function loadPolicy(file) {
  try {
    const policy = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(policy.rules)) throw new Error("policy.rules must be an array");

    const ids = new Set();
    for (const rule of policy.rules) {
      if (!rule.id || ids.has(rule.id)) throw new Error(`rules require unique non-empty ids: ${rule.id ?? "missing id"}`);
      if (!rule.severity || !["block", "warning"].includes(rule.severity)) {
        throw new Error(`rule ${rule.id} requires severity=block|warning`);
      }
      if (!rule.mode || !["direct", "transitive"].includes(rule.mode)) {
        throw new Error(`rule ${rule.id} requires mode=direct|transitive`);
      }
      if ((!Array.isArray(rule.sourceDirectories) || rule.sourceDirectories.length === 0) &&
          (!Array.isArray(rule.sourcePatterns) || rule.sourcePatterns.length === 0)) {
        throw new Error(`rule ${rule.id} requires sourceDirectories or sourcePatterns`);
      }
      if ((!Array.isArray(rule.targetDirectories) || rule.targetDirectories.length === 0) &&
          (!Array.isArray(rule.targetPatterns) || rule.targetPatterns.length === 0) &&
          (!Array.isArray(rule.targetSpecifiers) || rule.targetSpecifiers.length === 0) &&
          !rule.disallowDifferentPageDomain) {
        throw new Error(`rule ${rule.id} requires targetDirectories, targetPatterns, or disallowDifferentPageDomain`);
      }
      if (rule.excludedTargetDirectories !== undefined && !Array.isArray(rule.excludedTargetDirectories)) {
        throw new Error(`rule ${rule.id} excludedTargetDirectories must be an array when provided`);
      }
      ids.add(rule.id);
    }
    return policy.rules;
  } catch (error) {
    console.error(`Invalid architecture policy: ${error.message}`);
    process.exit(2);
  }
}

const layerRules = loadPolicy(policyFile);
const config = loadTsConfig(sourceRoot);
const violations = [];
const warnings = [];
const unresolved = [];
const files = [];
const sourceCache = new Map();
const importsCache = new Map();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (SOURCE_EXTENSIONS.includes(path.extname(entry.name))) files.push(fullPath);
  }
}
walk(sourceRoot);

if (targetFile && (!files.includes(targetFile) || !targetFile.startsWith(`${sourceRoot}${path.sep}`))) {
  console.error(`Target file must be a source file inside ${sourceRoot}: ${targetFile}`);
  process.exit(2);
}

function relative(file) {
  return path.relative(sourceRoot, file).split(path.sep).join("/");
}

function inDirectory(file, directory) {
  const value = relative(file);
  return value === directory || value.startsWith(`${directory}/`);
}

function matchesPattern(file, pattern) {
  return new RegExp(pattern).test(relative(file));
}

function pageDomain(file) {
  return relative(file).match(/^pages\/([^/]+)\//)?.[1] ?? null;
}

function isForbiddenTarget(file, rule, sourceFile) {
  const targetDirectories = rule.targetDirectories ?? [];
  const targetPatterns = rule.targetPatterns ?? [];
  const excludedTargetDirectories = rule.excludedTargetDirectories ?? [];
  const isDifferentPageDomain = rule.disallowDifferentPageDomain &&
    pageDomain(sourceFile) !== null && pageDomain(file) !== null &&
    pageDomain(sourceFile) !== pageDomain(file);
  const isTarget = isDifferentPageDomain ||
    targetDirectories.some((directory) => inDirectory(file, directory)) ||
    targetPatterns.some((pattern) => matchesPattern(file, pattern));
  if (!isTarget) return false;
  return !excludedTargetDirectories.some((directory) => inDirectory(file, directory));
}

function sourceOf(file) {
  if (!sourceCache.has(file)) sourceCache.set(file, fs.readFileSync(file, "utf8"));
  return sourceCache.get(file);
}

function dependenciesOf(file) {
  if (importsCache.has(file)) return importsCache.get(file);
  const source = sourceOf(file);
  const dependencies = [];
  for (const { specifier, index } of extractImports(source)) {
    if (!isLocalSourceSpecifier(specifier, config)) continue;
    const resolved = resolveImport(specifier, file, config);
    if (!resolved) {
      unresolved.push({ file: relative(file), line: lineAt(source, index), specifier });
      continue;
    }
    dependencies.push({ resolved, specifier, index, file });
  }
  importsCache.set(file, dependencies);
  return dependencies;
}

function directForbiddenDependency(startFile, rule) {
  const localDependency = dependenciesOf(startFile).find((dependency) =>
    isForbiddenTarget(dependency.resolved, rule, startFile),
  )
  if (localDependency) return localDependency

  const source = sourceOf(startFile)
  const targetSpecifiers = rule.targetSpecifiers ?? []
  for (const { specifier, index } of extractImports(source)) {
    if (targetSpecifiers.some((pattern) => new RegExp(pattern).test(specifier))) {
      return { file: startFile, index, specifier, target: specifier }
    }
  }
  return null
}

function transitiveForbiddenDependency(
  startFile,
  rule,
  visited = new Set(),
) {
  if (visited.has(startFile)) return null;
  visited.add(startFile);

  for (const dependency of dependenciesOf(startFile)) {
    if (isForbiddenTarget(dependency.resolved, rule, startFile)) {
      return { ...dependency, target: dependency.resolved };
    }

    const nested = transitiveForbiddenDependency(
      dependency.resolved,
      rule,
      visited,
    );
    if (nested) return nested;
  }

  return null;
}

for (const file of targetFile ? [targetFile] : files) {
  for (const rule of layerRules) {
    const sourceDirectories = rule.sourceDirectories ?? [];
    const sourcePatterns = rule.sourcePatterns ?? [];
    if (!sourceDirectories.some((directory) => inDirectory(file, directory)) &&
        !sourcePatterns.some((pattern) => matchesPattern(file, pattern))) continue;

    const dependency = rule.mode === "transitive"
      ? transitiveForbiddenDependency(file, rule)
      : directForbiddenDependency(file, rule);
    if (!dependency) continue;

    const diagnosticSource = sourceOf(dependency.file ?? file);
    const diagnostic = {
      file: relative(dependency.file ?? file),
      line: lineAt(diagnosticSource, dependency.index),
      rule: rule.id,
      message: rule.message ?? "Architecture boundary violation.",
      import: dependency.specifier,
      target: dependency.target
        ?? (dependency.resolved ? relative(dependency.resolved) : dependency.specifier),
    };

    if (rule.severity === "warning") warnings.push(diagnostic);
    else violations.push(diagnostic);
  }
}

for (const warning of warnings) {
  console.error(`${warning.file}:${warning.line} [WARNING] ${warning.rule}: ${warning.message} (${warning.import} → ${warning.target})`);
}
for (const violation of violations) {
  console.error(`${violation.file}:${violation.line} [BLOCK] ${violation.rule}: ${violation.message} (${violation.import} → ${violation.target})`);
}

if (unresolved.length > 0) {
  console.error(`Unable to resolve ${unresolved.length} local import(s). These are errors so boundary checks cannot silently pass unresolved imports.`);
  for (const item of unresolved) console.error(`${item.file}:${item.line} [ERROR] unresolved import: ${item.specifier}`);
  process.exit(2);
}

if (violations.length > 0) process.exit(1);
console.log(`Architecture boundary check passed${warnings.length ? ` with ${warnings.length} warning(s)` : ""}.`);
