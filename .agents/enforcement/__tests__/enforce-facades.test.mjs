#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hooksDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../hooks'
)
const settings = path.resolve(path.dirname(hooksDirectory), 'settings.json')
const facadePath =
  '/home/pw/workspace/nino/nino-app/apps/manager/src/pages/catalog/facades/useCatalogFacade.ts'
const { match, violations } = await import(
  path.join(hooksDirectory, 'enforce-facades.mjs')
)

const validate = (content) => violations(facadePath, 'Write', content.split('\n'))
const configuration = JSON.parse(fs.readFileSync(settings, 'utf8'))

for (const event of ['PreToolUse', 'PostToolUse']) {
  assert.ok(
    configuration.hooks[event][0].hooks.some(({ command }) =>
      command.includes('enforce-facades.mjs')
    )
  )
}

assert.equal(match(facadePath), true)
assert.equal(
  match(
    '/home/pw/workspace/nino/nino-app/apps/manager/src/pages/catalog/facades/useCatalogFacade.test.tsx'
  ),
  false,
  'facade rules do not reach the facade test file'
)
assert.equal(
  match(
    '/home/pw/workspace/nino/nino-app/apps/manager/src/pages/catalog/facades/useCatalogFacade.mock.ts'
  ),
  false,
  'facade rules do not reach the facade mock file'
)
assert.equal(
  match('/home/pw/workspace/nino/nino-app/apps/manager/src/pages/catalog/hooks/useCatalog.ts'),
  false
)
assert.deepEqual(
  validate('return { submitCreate: mutations.submitCreate, ...clientState }'),
  []
)

for (const source of [
  'if (!name) return',
  'try { await mutation.mutateAsync() } catch (error) {}',
  'const name = value.trim()',
  'const values = items.map(toItem)',
  'const command = useCallback(() => mutation.mutate(), [mutation])',
]) {
  assert.ok(validate(source).length > 0, source)
}

assert.ok(validate('const createCommand = () => mutation.mutate()').length > 0)
assert.ok(validate('return { onSubmit: () => mutation.mutate() }').length > 0)
assert.ok(validate('export const useLoginFacade = () => useLoginForm()').length > 0)
assert.deepEqual(
  validate(`export const useLoginFacade = () => {
  const mutation = useLogin()
  const form = useLoginForm(mutation.mutateAsync)
  return { ...form, isPending: mutation.isPending }
}`),
  []
)

console.log('Facade enforcement tests passed.')
