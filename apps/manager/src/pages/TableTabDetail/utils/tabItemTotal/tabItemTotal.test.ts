import { describe, expect, it } from 'vitest'

import { tabItemTotal } from './tabItemTotal'
import { tabItemTotalMock } from './tabItemTotal.mock'

describe('tabItemTotal', () => {
  it('multiplies the unit price by the quantity', () => {
    expect(tabItemTotal(tabItemTotalMock.plainItem)).toBe(36)
  })

  it('adds the modifiers to each unit before multiplying', () => {
    expect(tabItemTotal(tabItemTotalMock.itemWithModifiers)).toBe(26)
  })

  it('rounds floating point noise to cents', () => {
    expect(tabItemTotal(tabItemTotalMock.noisyItem)).toBe(0.3)
  })
})
