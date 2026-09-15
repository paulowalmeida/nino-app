import { describe, expect, it, vi } from 'vitest'

import { setCurrentUnit } from './set-current-unit'
import { setCurrentUnitMock } from './set-current-unit.mock'

describe(setCurrentUnit.name, () => {
  it('remembers which unit the shell is showing', () => {
    const set = vi.fn()

    setCurrentUnit(set, setCurrentUnitMock.unitId)

    expect(set).toHaveBeenCalledWith({
      currentUnitId: setCurrentUnitMock.unitId,
    })
  })

  it('clears the unit when none is selected', () => {
    const set = vi.fn()

    setCurrentUnit(set, null)

    expect(set).toHaveBeenCalledWith({ currentUnitId: null })
  })
})
