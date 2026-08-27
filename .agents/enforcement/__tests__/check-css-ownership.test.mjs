#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const checker = path.resolve('enforcement/check-css-ownership.mjs')
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nino-css-ownership-'))

try {
  fs.mkdirSync(path.join(root, 'pages/Settings'), { recursive: true })
  fs.mkdirSync(path.join(root, 'styles'), { recursive: true })
  fs.writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@styles/*': ['styles/*'] } } }))
  fs.writeFileSync(path.join(root, 'styles/settingsCard.module.css'), '.panel { display: flex; }')
  fs.writeFileSync(path.join(root, 'pages/Settings/Settings.tsx'), 'import styles from "../../styles/settingsCard.module.css"\nexport const Settings = () => <div className={styles.panel} />')

  let result = spawnSync(process.execPath, [checker, root], { encoding: 'utf8' })
  assert.equal(result.status, 1, 'structural shared CSS must fail ownership')

  fs.writeFileSync(path.join(root, 'styles/motion.module.css'), '.deal { animation: deal 1s; }')
  fs.writeFileSync(path.join(root, 'pages/Settings/Settings.tsx'), 'import motion from "../../styles/motion.module.css"\nexport const Settings = () => <div className={motion.deal} />')
  result = spawnSync(process.execPath, [checker, root], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}

console.log('CSS ownership enforcement tests passed.')
