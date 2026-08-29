import { expect, it } from 'vitest'
import { clockLabel } from './clock'
it('formats a clock label', () =>
  expect(clockLabel('2026-08-29T18:00:00.000Z')).toContain('h'))
