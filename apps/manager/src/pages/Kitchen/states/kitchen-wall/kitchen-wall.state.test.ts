import { beforeEach, describe, expect, it } from 'vitest'

import { useKitchenWallStore } from './kitchen-wall.state'
import {
  arrangedIdsMock,
  orderIdMock,
  stageMock,
} from './kitchen-wall.state.mock'

describe('useKitchenWallStore', () => {
  beforeEach(() =>
    useKitchenWallStore.setState({
      draggingOrderId: null,
      arrangement: {},
    })
  )

  it('starts with nothing in the air and no arrangement', () => {
    const state = useKitchenWallStore.getState()
    expect(state.draggingOrderId).toBeNull()
    expect(state.arrangement).toEqual({})
  })

  it('lifts an order', () => {
    // Act
    useKitchenWallStore.getState().startDrag(orderIdMock)

    // Assert
    expect(useKitchenWallStore.getState().draggingOrderId).toBe(orderIdMock)
  })

  it('puts the card down and forgets the session', () => {
    // Arrange
    useKitchenWallStore.getState().startDrag(orderIdMock)

    // Act
    useKitchenWallStore.getState().endDrag()

    // Assert
    const state = useKitchenWallStore.getState()
    expect(state.draggingOrderId).toBeNull()
  })

  it('remembers the arrangement of one trail without touching the others', () => {
    // Arrange
    useKitchenWallStore.getState().arrangeStage('waiting', ['order-9'])

    // Act
    useKitchenWallStore.getState().arrangeStage(stageMock, arrangedIdsMock)

    // Assert
    expect(useKitchenWallStore.getState().arrangement).toEqual({
      waiting: ['order-9'],
      preparing: arrangedIdsMock,
    })
  })
})
