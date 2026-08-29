import { expect, it } from 'vitest'
import { resolveSlug } from './resolve-slug'
it('uses a path slug on localhost', () =>
  expect(resolveSlug('loja')).toBe('loja'))
