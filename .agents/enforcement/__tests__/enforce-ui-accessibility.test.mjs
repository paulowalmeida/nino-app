#!/usr/bin/env node

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

const hooksDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../hooks");
const { fileViolations, match, violations } = await import(path.join(hooksDirectory, "enforce-ui-accessibility.mjs"));
const pageComponent = "/workspace/apps/manager/src/pages/catalog/components/CatalogList/CatalogList.tsx";

assert.equal(match(pageComponent), true);
assert.equal(match("/workspace/apps/manager/src/layouts/AppLayout/AppLayout.module.css"), true);
assert.equal(match("/workspace/apps/manager/src/shared/services/http.service.ts"), false);
assert.equal(match("/workspace/apps/manager/src/UI/atoms/Button.tsx"), false);
assert.match(violations(pageComponent, "Write", ["<img />"])[0], /without alt/);
assert.match(violations(pageComponent, "Write", ['<button aria-label="Button" />'])[0], /generic/);
assert.match(violations(pageComponent, "Write", ["outline: none"])[0], /visible focus/);
assert.match(
  fileViolations(pageComponent, "Write", ["<PhoneInput value={phone} />"])[0],
  /PhoneInput has no accessible name/
);
assert.deepEqual(
  fileViolations(pageComponent, "Write", ["<PhoneInput aria-label=\"Telefone\" />"]),
  []
);

console.log("UI accessibility enforcement tests passed.");
