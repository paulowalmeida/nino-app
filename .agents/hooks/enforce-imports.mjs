#!/usr/bin/env node

import { runSkillHook } from './hook-kit.mjs'

const match = (path) => /\.tsx?$/.test(path)

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`

    const workspaceBarrel = line.match(/from ['"]@nino\/(ds|lib|forms|api-types)['"]/)
    if (workspaceBarrel) found.push(`${at}: barrel de @nino/${workspaceBarrel[1]} — importar subcaminho`)

    if (/from ['"]@ds\//.test(line)) {
      found.push(`${at}: internal @ds/* alias — use a public @nino/ds/* subpath`)
    }

    if (/from ['"](?:styled-components|@emotion\/react|@emotion\/styled|jss|@stitches\/react)['"]/.test(line)) {
      found.push(`${at}: CSS-in-JS or a second styling system — use the project's Tailwind and CSS Modules`)
    }

    if (/from ['"][^'"]*packages\/ds\/src\//.test(line)) {
      found.push(`${at}: direct packages/ds/src import — use a public @nino/ds/* subpath`)
    }

    const folderBarrel = line.match(/from ['"]@(components|compositions|elements|skeletons|layouts)\/[A-Za-z0-9]+['"]/) 
    if (folderBarrel) found.push(`${at}: folder barrel — import the concrete file`)

    if (/from ['"]@\//.test(line)) found.push(`${at}: @/ alias does not exist`)
  })

  return found
}

await runSkillHook({ name: 'enforce-imports', match, violations })
