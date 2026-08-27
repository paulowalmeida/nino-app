import { describe, expect, it } from 'vitest'

import { brl } from './money'

describe('brl', () => {
  it('formats a number as brazilian currency', () => {
    expect(brl(24.9)).toBe('R$ 24,90')
  })

  it('formats a numeric string as brazilian currency', () => {
    expect(brl('1299.9')).toBe('R$ 1.299,90')
  })

  it('shows a dash for null, undefined, and non-numeric values', () => {
    expect(brl(null)).toBe('—')
    expect(brl(undefined)).toBe('—')
    expect(brl('not a price')).toBe('—')
  })
})
