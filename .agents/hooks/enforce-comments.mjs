#!/usr/bin/env node

import { runSkillHook } from './hook-kit.mjs'

const match = (path) => /\.[cm]?[jt]sx?$/.test(path)
const commentMarker = /(?:\/\/|\/\*)\s*(?:WHY|CONSTRAINT|WORKAROUND):/i
const aaaMarker = /\/\/\s*(?:Arrange|Act|Assert)(?:\s*\/\s*(?:Arrange|Act|Assert))*\s*$/i

const withoutStrings = (line) =>
  line.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '')

const isTestFile = (path) => /\/(?:__tests__|.*\.test\.[cm]?[jt]sx?$)/.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  lines.forEach((line, index) => {
    const source = withoutStrings(line)
    const token = source.match(/\/\/|\/\*/)
    if (!token) return

    const comment = source.slice(token.index)
    if (commentMarker.test(comment)) return
    if (isTestFile(path) && aaaMarker.test(comment)) return

    found.push(
      `linha ${index + 1} do trecho escrito: comentário novo é proibido — use código autoexplicativo ou um marcador WHY:, CONSTRAINT: ou WORKAROUND: para uma razão não expressável no código`
    )
  })

  return found
}

await runSkillHook({ name: 'enforce-comments', match, violations })
