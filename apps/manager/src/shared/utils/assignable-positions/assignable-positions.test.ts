import { describe, expect, it } from 'vitest'

import { assignablePositions, promotionTargets } from './assignable-positions'
import {
  allPositionsMock,
  cashierPositionMock,
  managerPositionMock,
  staffPositionMock,
} from './assignable-positions.mock'

describe('assignablePositions', () => {
  it('offers everything below the owner, never the owner cargo', () => {
    expect(assignablePositions(allPositionsMock, 100)).toEqual([
      managerPositionMock,
      cashierPositionMock,
      staffPositionMock,
    ])
  })

  it('offers only strictly lower levels to a manager', () => {
    expect(assignablePositions(allPositionsMock, 50)).toEqual([
      cashierPositionMock,
      staffPositionMock,
    ])
  })

  it('offers nothing to the lowest level', () => {
    expect(assignablePositions(allPositionsMock, 10)).toEqual([])
  })
})

describe('promotionTargets', () => {
  it('keeps only cargos above the current level', () => {
    const assignable = assignablePositions(allPositionsMock, 100)

    expect(promotionTargets(assignable, 10)).toEqual([
      managerPositionMock,
      cashierPositionMock,
    ])
  })

  it('offers nothing from the highest assignable cargo', () => {
    const assignable = assignablePositions(allPositionsMock, 100)

    expect(promotionTargets(assignable, 50)).toEqual([])
  })
})
