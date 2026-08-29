import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useKitchenWallStore } from '@pages/Kitchen/states/kitchen-wall/kitchen-wall.state'

import { useKitchenWall } from './useKitchenWall'
import {
  finishedOrderMock,
  otherPreparingOrderMock,
  preparingOrderMock,
  wallMock,
} from './useKitchenWall.mock'

describe('useKitchenWall', () => {
  beforeEach(() =>
    useKitchenWallStore.setState({
      draggingOrderId: null,
      arrangement: {},
    })
  )

  it('advances the order when it lands on another trail', () => {
    // Arrange
    const advance = vi.fn()
    const { result } = renderHook(() => useKitchenWall(wallMock, advance))

    // Act
    act(() => result.current.liftOrder(preparingOrderMock.id))
    act(() => result.current.dropOrder('finished', null))

    // Assert
    expect(advance).toHaveBeenCalledWith(
      preparingOrderMock.id,
      'READY_FOR_PICKUP'
    )
  })

  it('reorders instead of advancing when it lands on its own trail', () => {
    // Arrange
    const advance = vi.fn()
    const { result } = renderHook(() => useKitchenWall(wallMock, advance))

    // Act
    act(() => result.current.liftOrder(otherPreparingOrderMock.id))
    act(() => result.current.dropOrder('preparing', preparingOrderMock.id))

    // Assert
    expect(advance).not.toHaveBeenCalled()
    expect(useKitchenWallStore.getState().arrangement.preparing).toEqual([
      otherPreparingOrderMock.id,
      preparingOrderMock.id,
    ])
  })

  it('does not return a finished order to preparation', () => {
    // Arrange
    const advance = vi.fn()
    const { result } = renderHook(() => useKitchenWall(wallMock, advance))

    // Act
    act(() => result.current.liftOrder(finishedOrderMock.id))
    act(() => result.current.dropOrder('preparing', preparingOrderMock.id))

    // Assert
    expect(advance).not.toHaveBeenCalled()
    expect(useKitchenWallStore.getState().arrangement.preparing).toBeUndefined()
  })

  it('commits nothing when the card lands outside every trail', () => {
    // Arrange
    const advance = vi.fn()
    const { result } = renderHook(() => useKitchenWall(wallMock, advance))

    // Act
    act(() => result.current.liftOrder(preparingOrderMock.id))
    act(() => result.current.dropOrder(null, null))

    // Assert
    expect(advance).not.toHaveBeenCalled()
    expect(useKitchenWallStore.getState().draggingOrderId).toBeNull()
  })

  it('names the order currently in the air', () => {
    const { result } = renderHook(() => useKitchenWall(wallMock, vi.fn()))
    act(() => result.current.liftOrder(preparingOrderMock.id))
    expect(result.current.draggingOrder).toEqual(preparingOrderMock)
  })

  it('uses the remembered order when reordering again', () => {
    const advance = vi.fn()
    const { result } = renderHook(() => useKitchenWall(wallMock, advance))

    act(() =>
      useKitchenWallStore
        .getState()
        .arrangeStage('preparing', [
          otherPreparingOrderMock.id,
          preparingOrderMock.id,
        ])
    )
    act(() => result.current.liftOrder(preparingOrderMock.id))
    act(() => result.current.dropOrder('preparing', otherPreparingOrderMock.id))

    expect(useKitchenWallStore.getState().arrangement.preparing).toEqual([
      preparingOrderMock.id,
      otherPreparingOrderMock.id,
    ])
  })
})
