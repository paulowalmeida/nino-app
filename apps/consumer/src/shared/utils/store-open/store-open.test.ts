import { expect, it } from 'vitest'
import { isStoreOpen } from './store-open'
it('closes with no hours', () =>
  expect(isStoreOpen([], 'America/Belem')).toBe(false))
