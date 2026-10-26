import { describe, expect, it } from 'vitest'

import { arrangeOrders, moveWithin } from './arrange-orders'
import {
  naturalQueueMock,
  orderAMock,
  orderBMock,
  orderCMock,
} from './arrange-orders.mock'

describe('arrangeOrders', () => {
  it('keeps the natural queue when nothing was arranged by hand', () => {
    expect(arrangeOrders(naturalQueueMock, undefined)).toEqual(naturalQueueMock)
    expect(arrangeOrders(naturalQueueMock, [])).toEqual(naturalQueueMock)
  })

  it('follows the order the cook chose', () => {
    const result = arrangeOrders(naturalQueueMock, [
      'order-c',
      'order-a',
      'order-b',
    ])
    expect(result).toEqual([orderCMock, orderAMock, orderBMock])
  })

  it('puts a newly arrived order in front of the arrangement', () => {
    // Arrange: a comanda C chegou depois que o chapista arrumou A e B
    const result = arrangeOrders(naturalQueueMock, ['order-b', 'order-a'])

    // Assert
    expect(result).toEqual([orderCMock, orderBMock, orderAMock])
  })

  it('ignores an arranged order that already left the trail', () => {
    const result = arrangeOrders(
      [orderAMock],
      ['order-b', 'order-a', 'order-c']
    )
    expect(result).toEqual([orderAMock])
  })
})

describe('moveWithin', () => {
  const ids = ['order-a', 'order-b', 'order-c']

  it('drops the card into the place of the one it landed on', () => {
    expect(moveWithin(ids, 'order-c', 'order-a')).toEqual([
      'order-c',
      'order-a',
      'order-b',
    ])
  })

  it('places a card after the target when it moves forward in the queue', () => {
    expect(moveWithin(ids, 'order-a', 'order-b')).toEqual([
      'order-b',
      'order-a',
      'order-c',
    ])
  })

  it('sends the card to the end when it lands on open space', () => {
    expect(moveWithin(ids, 'order-a', null)).toEqual([
      'order-b',
      'order-c',
      'order-a',
    ])
  })

  it('leaves the card where it is when it lands on itself', () => {
    expect(moveWithin(ids, 'order-b', 'order-b')).toEqual([
      'order-a',
      'order-b',
      'order-c',
    ])
  })

  it('appends a card the arrangement did not know yet', () => {
    expect(moveWithin(ids, 'order-z', 'order-b')).toEqual([
      'order-a',
      'order-z',
      'order-b',
      'order-c',
    ])
  })
})
