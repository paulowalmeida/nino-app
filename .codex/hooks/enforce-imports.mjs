#!/usr/bin/env node

import { runSkillHook } from './hook-kit.mjs'

const match = (path) => /\.tsx?$/.test(path)

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    const workspaceBarrel = line.match(/from ['"]@nino\/(ds|lib|forms|api-types)['"]/)
    if (workspaceBarrel) found.push(`${at}: barrel de @nino/${workspaceBarrel[1]} — importar subcaminho`)

    if (/from ['"]@ds\//.test(line)) {
      found.push(`${at}: alias interno @ds/* — usar subcaminho público de @nino/ds/*`)
    }

    if (/from ['"](?:styled-components|@emotion\/react|@emotion\/styled|jss|@stitches\/react)['"]/.test(line)) {
      found.push(`${at}: CSS-in-JS ou segundo sistema de estilo — usar Tailwind e CSS Modules do projeto`)
    }

    if (/from ['"][^'"]*packages\/ds\/src\//.test(line)) {
      found.push(`${at}: import direto de packages/ds/src — usar subcaminho público de @nino/ds/*`)
    }

    const folderBarrel = line.match(/from ['"]@(components|compositions|elements|skeletons|layouts)\/[A-Za-z0-9]+['"]/) 
    if (folderBarrel) found.push(`${at}: barrel de pasta — importar o arquivo concreto`)

    if (/from ['"]@\//.test(line)) found.push(`${at}: alias @/ não existe`)
  })

  return found
}

await runSkillHook({ name: 'enforce-imports', match, violations })
