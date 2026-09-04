#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runSkillHook } from './hook-kit.mjs'

const isTestArtifact = (path) =>
  /\.(test|mock)\.tsx?$/.test(path) && path.includes('/apps/manager/src/')

/**
 * `<Unidade>.behavior.test.tsx` e o segundo teste da mesma unidade: interacao
 * separada do render. A unidade continua sendo `<Unidade>`.
 */
const UNIT_ARTIFACT_SUFFIX = /\.(?:behavior\.)?(?:test|mock)\.tsx?$/

export const match = (path) => isTestArtifact(path)

const normalizedName = (value) => value.replace(/[-_]/g, '').toLowerCase()

export const violations = (filePath, toolName, lines) => {
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
        found.push('teste interativo sem ação observável — exercitar click/change/submit com fireEvent ou userEvent')
      }
    }
  }

  if (directory.split(path.sep).includes('states') && folderName.endsWith('.store')) {
    found.push('state folder cannot use .store; use <state>.state/')
  }

  if (filePath.includes('/src/__tests__/')) {
    found.push('teste ou fixture deve ficar colocalizado, ao lado do arquivo fonte — não em src/__tests__/')
  }

  const isStateStoreUnit =
    directory.split(path.sep).includes('states') &&
    (unitName === `${folderName}.state` || unitName === `${folderName}.store`)

  if (!isStateStoreUnit && normalizedName(folderName) !== normalizedName(unitName)) {
    found.push(
      `unidade testada deve ter pasta própria ${unitName}/ contendo fonte, teste e mock`
    )
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
      found.push(`teste exige fonte ${unitName}.ts[x] na mesma pasta`)
    }
    if (!mockCandidates.some((candidate) => fs.existsSync(candidate))) {
      found.push(`teste exige ${unitName}.mock.ts[x] significativo na mesma pasta`)
    }
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (/\bas never\b/.test(line))
      found.push(`${at}: as never — usar as unknown as T`)
    if (isMock && /\b(?:vi|jest)\.(?:fn|spyOn|mock)\s*\(/.test(line))
      found.push(`${at}: mock comportamental em .mock.ts[x] — manter no teste`)
    if (
      isMock &&
      (/^\s*(?:export\s+)?(?:async\s+)?function\b/.test(line) ||
        /^\s*(?:export\s+)?const\s+[A-Za-z_$][\w$]*\s*=\s*(?:async\s*)?\(/.test(line) ||
        /^\s*(?:export\s+)?const\s+[A-Za-z_$][\w$]*\s*=\s*(?:async\s*)?[^=]*=>/.test(line))
    )
      found.push(`${at}: função/factory em .mock.ts[x] — arquivo aceita apenas props e dados`)
    if (isTest && /it\(['"]test ?\d*['"]/i.test(line))
      found.push(`${at}: nome de it() genérico`)
  })

  if (isMock && lines.every((line) => !line.trim())) {
    found.push('arquivo de mock/fixture não pode ser vazio')
  }

  return found
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({ name: 'enforce-tests', match, violations })
}
