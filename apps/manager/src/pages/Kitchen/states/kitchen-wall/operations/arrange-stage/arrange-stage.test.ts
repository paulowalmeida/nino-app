import { describe, expect, it, vi } from 'vitest'

import { arrangeStage } from './arrange-stage'
import {
  orderIdsMock,
  previousArrangementMock,
  stageMock,
} from './arrange-stage.mock'

describe('arrangeStage', () => {
  it('records the arrangement of one trail, keeping the others', () => {
    // Arrange
    const set = vi.fn()
    arrangeStage(set, stageMock, orderIdsMock)

    // Act: o store passa o estado anterior para o recalculador
    const recalculate = set.mock.calls[0][0] as (state: {
      arrangement: Record<string, string[]>
    }) => { arrangement: Record<string, string[]> }
    const result = recalculate({ arrangement: previousArrangementMock })

    // Assert
    expect(result.arrangement).toEqual({
      ...previousArrangementMock,
      [stageMock]: orderIdsMock,
    })
  })
})
