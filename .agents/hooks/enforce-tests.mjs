#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runSkillHook } from './hook-kit.mjs'

const isTestArtifact = (path) =>
  /\.(test|mock)\.tsx?$/.test(path) && path.includes('/apps/manager/src/')

/**
 * `<Unit>.behavior.test.tsx` is the second test for the same unit: interaction
 * separated from rendering. The unit remains `<Unit>`.
 */
const UNIT_ARTIFACT_SUFFIX = /\.(?:behavior\.)?(?:test|mock)\.tsx?$/

export const match = (path) => isTestArtifact(path)

const normalizedName = (value) => value.replace(/[-_]/g, '').toLowerCase()

export const violations = (filePath, toolName, lines) => {
  const found = []
  const isTest = /\.test\.tsx?$/.test(filePath)
  const isMock = /\.mock\.tsx?$/.test(filePath)

  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`
    if (/\bas never\b/.test(line))
      found.push(`${at}: as never — use as unknown as T`)
    if (isMock && /\b(?:vi|jest)\.(?:fn|spyOn|mock)\s*\(/.test(line))
      found.push(`${at}: behavioral mock inside .mock.ts[x] — keep it in the test`)
    if (
      isMock &&
      (/^\s*(?:export\s+)?(?:async\s+)?function\b/.test(line) ||
        /^\s*(?:export\s+)?const\s+[A-Za-z_$][\w$]*\s*=\s*(?:async\s*)?\(/.test(line) ||
        /^\s*(?:export\s+)?const\s+[A-Za-z_$][\w$]*\s*=\s*(?:async\s*)?[^=]*=>/.test(line))
    )
      found.push(`${at}: function/factory inside .mock.ts[x] — the file accepts only props and data`)
    if (isTest && /it\(['"]test ?\d*['"]/i.test(line))
      found.push(`${at}: generic it() name`)
  })

  return found
}

export const fileViolations = (filePath, toolName, lines) => {
  const found = []
  const isTest = /\.test\.tsx?$/.test(filePath)
  const isMock = /\.mock\.tsx?$/.test(filePath)
  const directory = path.dirname(filePath)
  const fileName = path.basename(filePath)
  const unitName = fileName.replace(UNIT_ARTIFACT_SUFFIX, '')
  const folderName = path.basename(directory)

  if (isTest && filePath.endsWith('.tsx')) {
    const sourcePath = [
      path.join(directory, `${unitName}.tsx`),
      path.join(directory, `${unitName}.ts`),
    ].find((candidate) => fs.existsSync(candidate))
    if (sourcePath) {
      const source = fs.readFileSync(sourcePath, 'utf8')
      const hasInteraction = /on(?:Click|Change|Submit|ValueChange)=/.test(source)
      const hasUserAction = /fireEvent|userEvent|\.(?:click|type|clear|submit|change)\s*\(/.test(lines.join('\n'))
      if (hasInteraction && !hasUserAction) {
        found.push('interactive test without an observable action — exercise click/change/submit with fireEvent or userEvent')
      }
    }
  }

  if (directory.split(path.sep).includes('states') && folderName.endsWith('.store')) {
    found.push('state folder cannot use .store; use <state>.state/')
  }
  if (filePath.includes('/src/__tests__/')) {
    found.push('test or fixture must be colocated beside its source file — not in src/__tests__/')
  }

  const isStateStoreUnit =
    directory.split(path.sep).includes('states') &&
    (unitName === `${folderName}.state` || unitName === `${folderName}.store`)
  if (!isStateStoreUnit && normalizedName(folderName) !== normalizedName(unitName)) {
    found.push(`tested unit must have its own ${unitName}/ folder containing source, test, and mock`)
  }

  if (isTest) {
    const sourceCandidates = [
      path.join(directory, `${unitName}.ts`),
      path.join(directory, `${unitName}.tsx`),
    ]
    const mockCandidates = [
      path.join(directory, `${unitName}.mock.ts`),
      path.join(directory, `${unitName}.mock.tsx`),
    ]
    if (!sourceCandidates.some((candidate) => fs.existsSync(candidate))) {
      found.push(`test requires ${unitName}.ts[x] source in the same folder`)
    }
    if (!mockCandidates.some((candidate) => fs.existsSync(candidate))) {
      found.push(`test requires a meaningful ${unitName}.mock.ts[x] in the same folder`)
    }
  }

  if (isMock && lines.every((line) => !line.trim())) {
    found.push('mock/fixture file must not be empty')
  }

  return found
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({ name: 'enforce-tests', match, violations, fileViolations })
}
