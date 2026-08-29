import { expect, it } from 'vitest'
import { isTerminal } from './order-journey'
it('recognizes terminal status', () =>
  expect(isTerminal('DELIVERED')).toBe(true))
