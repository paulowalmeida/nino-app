import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSubscription } from '@hooks/account/useSubscription'
import { useUnitLimit } from '@hooks/store/useUnitLimit'

import {
  pendingPlan,
  planWithThreeUnits,
  unlimitedPlan,
} from './useUnitLimit.mock'

vi.mock('@hooks/account/useSubscription')

describe('useUnitLimit', () => {
  it('reports room while the count is under the plan limit', () => {
    // Arrange
    vi.mocked(useSubscription).mockReturnValue(planWithThreeUnits)

    // Act
    const { result } = renderHook(() => useUnitLimit(2))

    // Assert
    expect(result.current).toMatchObject({ limit: 3, isFull: false })
  })

  it('reports full once the count reaches the limit', () => {
    // Arrange
    vi.mocked(useSubscription).mockReturnValue(planWithThreeUnits)

    // Act
    const { result } = renderHook(() => useUnitLimit(3))

    // Assert
    expect(result.current.isFull).toBe(true)
  })

  it('stays full when the count already passed the limit', () => {
    // Arrange
    vi.mocked(useSubscription).mockReturnValue(planWithThreeUnits)

    // Act
    const { result } = renderHook(() => useUnitLimit(5))

    // Assert
    expect(result.current.isFull).toBe(true)
  })

  it('never reports full when the plan has no limit', () => {
    // Arrange
    vi.mocked(useSubscription).mockReturnValue(unlimitedPlan)

    // Act
    const { result } = renderHook(() => useUnitLimit(99))

    // Assert
    expect(result.current).toMatchObject({ limit: null, isFull: false })
  })

  it('holds the limit open while the subscription loads', () => {
    // Arrange
    vi.mocked(useSubscription).mockReturnValue(pendingPlan)

    // Act
    const { result } = renderHook(() => useUnitLimit(4))

    // Assert
    expect(result.current).toMatchObject({
      limit: null,
      planName: '',
      isFull: false,
      isPending: true,
    })
  })
})
