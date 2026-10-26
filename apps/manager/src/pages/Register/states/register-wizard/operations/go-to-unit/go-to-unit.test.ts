import { describe, expect, it, vi } from 'vitest'

import { goToUnit } from './go-to-unit'
import { goToUnitCompanyMock } from './go-to-unit.mock'

describe('goToUnit', () => {
  it('keeps the company and opens the unit step', () => {
    const set = vi.fn()

    goToUnit(set, goToUnitCompanyMock)

    expect(set).toHaveBeenCalledWith({
      step: 3,
      company: goToUnitCompanyMock,
    })
  })
})
