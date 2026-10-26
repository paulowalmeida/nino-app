import { describe, expect, it } from 'vitest'

import { orderDestination } from './order-destination'
import {
  counterOrderMock,
  deliveryOrderMock,
  multiFormatStoreMock,
  singleFormatStoreMock,
  tableOrderMock,
} from './order-destination.mock'

describe('orderDestination', () => {
  it('names the table when the order carries a table number', () => {
    expect(orderDestination(tableOrderMock, multiFormatStoreMock)).toEqual({
      kind: 'table',
      label: 'Mesa 7',
    })
  })

  it('keeps the table label in a store with a single format', () => {
    // Arrange: identificador não classifica, então não segue a contagem
    const destination = orderDestination(tableOrderMock, singleFormatStoreMock)

    // Assert
    expect(destination).toEqual({ kind: 'table', label: 'Mesa 7' })
  })

  it('drops the label when the store sells through one format', () => {
    const destination = orderDestination(
      deliveryOrderMock,
      singleFormatStoreMock
    )

    expect(destination).toBeNull()
  })

  it('labels the channel when the store sells through more than one', () => {
    expect(orderDestination(deliveryOrderMock, multiFormatStoreMock)).toEqual({
      kind: 'delivery',
      label: 'Delivery',
    })
  })

  it('separates a counter sale from a table order', () => {
    expect(orderDestination(counterOrderMock, multiFormatStoreMock)).toEqual({
      kind: 'counter',
      label: 'Balcão',
    })
  })
})
