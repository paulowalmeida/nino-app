#!/usr/bin/env node
import { runSkillHook, sourceOnly } from './hook-kit.mjs'
const matchesSource = (path) => /\/src\/(guards|loaders)\//.test(path)
const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => lines.flatMap((line, index) => /^\s*export const (check|verify|load|guard\d*|loader\d*)\s*=/i.test(line) ? [`linha ${index + 1} do trecho escrito: nome genérico — explicitar o guard/loader`] : [])
await runSkillHook({ name: 'enforce-guards-loaders', match, violations })
