#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const checker = path.resolve("enforcement/check-architecture-boundaries.mjs");
const policy = path.resolve("enforcement/architecture-boundaries.json");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nino-boundary-"));

function write(relativePath, content) {
  const target = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function remove(relativePath) {
  fs.rmSync(path.join(tempRoot, relativePath));
}

function run(targetFile) {
  const args = targetFile
    ? [checker, tempRoot, policy, targetFile]
    : [checker, tempRoot];
  return spawnSync(process.execPath, args, { encoding: "utf8" });
}

try {
  write("tsconfig.json", JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["*"] } } }));
  write("shared/services/http.service.ts", "export const api = {};");
  write("pages/catalog/hooks/useCatalogQuery/useCatalogQuery.ts", "export const useCatalogQuery = () => [];");
  write("pages/catalog/facades/useCatalogFacade/useCatalogFacade.ts", 'import { useCatalogQuery } from "../../hooks/useCatalogQuery/useCatalogQuery"; export const useCatalogFacade = useCatalogQuery;');
  write("pages/catalog/components/CatalogList/CatalogList.tsx", 'import { useCatalogFacade } from "../../facades/useCatalogFacade/useCatalogFacade"; export const CatalogList = useCatalogFacade;');
  write("pages/catalog/hooks/ui/useSelection/useSelection.ts", "export const useSelection = () => null;");
  write("pages/catalog/Catalog.tsx", 'import { CatalogList } from "./components/CatalogList/CatalogList"; export const Catalog = CatalogList;');
  write("layouts/AppLayout/AppLayout.tsx", "export const AppLayout = () => null;");
  write("shared/utils/identity.ts", "export const identity = (value) => value;");

  let result = run();
  assert.equal(result.status, 0, result.stderr);

  write("pages/catalog/components/InvalidService/InvalidService.tsx", 'import { api } from "../../../../shared/services/http.service"; export const InvalidService = api;');
  result = run();
  assert.equal(result.status, 1, `${result.stderr}\n${result.stdout}\nA domain component importing a Service must fail.`);

  remove("pages/catalog/components/InvalidService/InvalidService.tsx");
  write("pages/catalog/components/ExternalService/ExternalService.tsx", 'import { lookupZipCode } from "@nino/lib/services/zip-code.service"; export const ExternalService = lookupZipCode;');
  result = run();
  assert.equal(result.status, 1, `${result.stderr}\nAn external integration package must fail in a domain component.`);

  remove("pages/catalog/components/ExternalService/ExternalService.tsx");
  write("pages/catalog/InvalidHook.tsx", 'import { useCatalogQuery } from "./hooks/useCatalogQuery/useCatalogQuery"; export const InvalidHook = useCatalogQuery;');
  result = run();
  assert.equal(result.status, 1, `${result.stderr}\nA Page source importing a raw integration Hook must fail.`);

  remove("pages/catalog/InvalidHook.tsx");
  write("pages/orders/Orders.tsx", "export const Orders = () => null;");
  write("pages/catalog/components/CrossDomain/CrossDomain.tsx", 'import { Orders } from "../../../orders/Orders"; export const CrossDomain = Orders;');
  result = run();
  assert.equal(result.status, 1, "A Page domain importing another Page domain must fail.");

  remove("pages/catalog/components/CrossDomain/CrossDomain.tsx");
  write("layouts/AppLayout/AppLayout.tsx", 'import { Catalog } from "../../pages/catalog/Catalog"; export const AppLayout = Catalog;');
  result = run();
  assert.equal(result.status, 1, "A Layout importing a Page must fail.");

  write("layouts/AppLayout/AppLayout.tsx", "export const AppLayout = () => null;");
  write("shared/utils/identity.ts", 'export { Catalog } from "../../pages/catalog/Catalog";');
  result = run();
  assert.equal(result.status, 1, "Shared code importing a Page must fail.");

  write("shared/utils/identity.ts", "export const identity = (value) => value;");
  write("pages/catalog/components/Unresolved/Unresolved.tsx", 'import thing from "@/shared/missing"; export const Unresolved = thing;');
  result = run();
  assert.equal(result.status, 2, "Unresolved local imports must fail closed.");

  result = run(path.join(tempRoot, "pages/catalog/Catalog.tsx"));
  assert.equal(result.status, 0, "A targeted check must ignore unrelated unresolved imports.");

  write("pages/catalog/components/CatalogList/CatalogList.tsx", 'import { useSelection } from "../../hooks/ui/useSelection/useSelection"; export const CatalogList = useSelection;');
  result = run(path.join(tempRoot, "pages/catalog/components/CatalogList/CatalogList.tsx"));
  assert.equal(result.status, 0, "A domain component may consume a presentation-only hooks/ui Hook.");

  write("pages/catalog/hooks/ui/useSelection/useSelection.ts", 'import { api } from "../../../../../shared/services/http.service"; export const useSelection = () => api;');
  result = run(path.join(tempRoot, "pages/catalog/hooks/ui/useSelection/useSelection.ts"));
  assert.equal(result.status, 1, "A hooks/ui Hook must not reach integration.");

  result = run(path.join(tempRoot, "pages/catalog/components/Unresolved/Unresolved.tsx"));
  assert.equal(result.status, 2, "A targeted check must fail on its own unresolved import.");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log("Architecture boundary checker tests passed.");
