#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const checker = path.resolve("enforcement/check-architecture-boundaries.mjs");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nino-boundary-"));

function write(relativePath, content) {
  const target = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function run() {
  return spawnSync(process.execPath, [checker, tempRoot], { encoding: "utf8" });
}

try {
  write("UI/atoms/Button.module.css", ".button {}\n");
  write("styles/Button.module.css", ".button {}\n");
  write("UI/atoms/Button.tsx", [
    'import { Button as DsButton } from "@nino/ds/components/Button";',
    'import { useQuery } from "@tanstack/react-query";',
    'import "./Button.module.css";',
    'import "@styles/Button.module.css";',
    'export function Button() { return [DsButton, useQuery]; }',
  ].join("\n"));
  write("UI/molecules/Search.tsx", "export function Search() { return null; }\n");
  write("UI/organisms/Table.tsx", "export function Table() { return null; }\n");
  write("UI/templates/User.tsx", 'import { Table } from "../organisms/Table";\nexport function User() { return <Table />; }\n');
  write("UI/pages/User.tsx", 'import { User } from "../templates/User";\nexport function UserPage() { return <User />; }\n');
  write("UI/layouts/App.tsx", 'import { UserPage } from "../pages/User";\nexport function AppLayout() { return <UserPage />; }\n');
  write("states/useSessionStore.ts", "export const store = {};\n");
  write("tsconfig.json", JSON.stringify({ compilerOptions: { baseUrl: ".", paths: {
    "@states/*": ["states/*"],
    "@styles/*": ["styles/*"],
  } } }));

  let result = run();
  assert.equal(result.status, 0, result.stderr);

  write("UI/atoms/InvalidRelative.tsx", 'import useStore from "../../states/useSessionStore";\n');
  result = run();
  assert.equal(result.status, 1, "A relative state import must fail.");

  fs.rmSync(path.join(tempRoot, "UI/atoms/InvalidRelative.tsx"));
  write("UI/atoms/InvalidAlias.tsx", 'import useStore from "@states/useSessionStore";\n');
  result = run();
  assert.equal(result.status, 1, "A tsconfig path alias to state must fail.");

  fs.rmSync(path.join(tempRoot, "UI/atoms/InvalidAlias.tsx"));
  write("UI/atoms/InvalidReExport.ts", 'export { store } from "@states/useSessionStore";\n');
  result = run();
  assert.equal(result.status, 1, "A re-export of state must fail.");

  fs.rmSync(path.join(tempRoot, "UI/atoms/InvalidReExport.ts"));
  write("UI/atoms/Barrel.ts", 'export { store } from "@states/useSessionStore";\n');
  write("UI/atoms/Indirect.tsx", 'import { store } from "./Barrel";\n');
  result = run();
  assert.equal(result.status, 1, "A transitive state dependency through a barrel must fail.");

  fs.rmSync(path.join(tempRoot, "UI/atoms/Barrel.ts"));
  fs.rmSync(path.join(tempRoot, "UI/atoms/Indirect.tsx"));
  write("services/Valid.ts", 'import useStore from "@states/useSessionStore";\n');
  result = run();
  assert.equal(result.status, 0, result.stderr);

  write("UI/atoms/InvalidComposition.tsx", 'import { Search } from "../molecules/Search";\n');
  result = run();
  assert.equal(result.status, 1, "An Atom importing a Molecule must fail.");

  fs.rmSync(path.join(tempRoot, "UI/atoms/InvalidComposition.tsx"));
  write("UI/atoms/InvalidAtomPeer.tsx", 'import { Button } from "./Button";\n');
  result = run();
  assert.equal(result.status, 1, "An application Atom importing another Atom must fail.");

  fs.rmSync(path.join(tempRoot, "UI/atoms/InvalidAtomPeer.tsx"));
  write("UI/pages/ValidPage.tsx", 'import { User } from "../templates/User";\n');
  result = run();
  assert.equal(result.status, 0, "A Page importing its Template must remain valid.");

  write("UI/pages/InvalidPage.tsx", 'import { Table } from "../organisms/Table";\n');
  result = run();
  assert.equal(result.status, 1, "A Page importing an Organism directly must fail.");

  fs.rmSync(path.join(tempRoot, "UI/pages/InvalidPage.tsx"));
  write("UI/pages/IndirectPage.tsx", 'import { User } from "../templates/User";\n');
  result = run();
  assert.equal(result.status, 0, "A Page may reach an Organism through its Template.");

  fs.rmSync(path.join(tempRoot, "UI/pages/IndirectPage.tsx"));
  write("UI/layouts/InvalidLayout.tsx", 'import { Table } from "../organisms/Table";\n');
  result = run();
  assert.equal(result.status, 1, "A Layout importing an Organism directly must fail.");

  fs.rmSync(path.join(tempRoot, "UI/layouts/InvalidLayout.tsx"));
  write("UI/atoms/Unresolved.tsx", 'import thing from "@states/missing";\n');
  result = run();
  assert.equal(result.status, 2, "Unresolved local imports must fail closed.");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log("Architecture boundary checker tests passed.");
