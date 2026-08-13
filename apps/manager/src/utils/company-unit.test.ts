import { describe, expect, it } from 'vitest'

import {
  currentUnit,
  nonCurrentUnit,
  otherNonCurrentUnit,
} from './company-unit.mock'
import { currentOrFirstUnit, unitLabel } from './company-unit'

describe('unitLabel', () => {
  it('uses the singular for a single unit', () => {
    expect(unitLabel(1)).toBe('1 unidade')
  })

  it('uses the plural for more than one unit', () => {
    expect(unitLabel(2)).toBe('2 unidades')
  })

  it('uses the plural for zero units', () => {
    expect(unitLabel(0)).toBe('0 unidades')
  })
})

describe('currentOrFirstUnit', () => {
  it('returns the unit marked as current', () => {
    // Arrange
    const units = [nonCurrentUnit, currentUnit]

    // Act
    const result = currentOrFirstUnit(units)

    // Assert
    expect(result.tenantId).toBe(currentUnit.tenantId)
  })

  it('falls back to the first unit when none is marked current', () => {
    // Arrange
    const units = [nonCurrentUnit, otherNonCurrentUnit]

    // Act
    const result = currentOrFirstUnit(units)

    // Assert
    expect(result.tenantId).toBe(nonCurrentUnit.tenantId)
  })
})
