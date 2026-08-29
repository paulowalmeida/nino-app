import { describe, expect, it } from 'vitest'

import {
  applyStatusToList,
  findOrderInLists,
  statusesFromKey,
} from './order-status-cache'
import {
  activeListMock,
  finishedListMock,
  otherOrderMock,
  preparingOrderMock,
} from './order-status-cache.mock'

describe('applyStatusToList', () => {
  it('drops the order from a trail that no longer accepts it', () => {
    // Arrange: o trilho ativo só aceita ACCEPTED e PREPARING
    const result = applyStatusToList(
      activeListMock,
      ['ACCEPTED', 'PREPARING'],
      preparingOrderMock,
      'READY_FOR_PICKUP'
    )

    // Assert
    expect(result.pages[0].data).toEqual([otherOrderMock])
  })

  it('takes the order into the trail that now accepts it', () => {
    // Arrange
    const result = applyStatusToList(
      finishedListMock,
      ['OUT_FOR_DELIVERY', 'READY_FOR_PICKUP'],
      preparingOrderMock,
      'READY_FOR_PICKUP'
    )

    // Assert
    expect(result.pages[0].data).toHaveLength(1)
    expect(result.pages[0].data[0].status).toBe('READY_FOR_PICKUP')
  })

  it('keeps the order in place when the trail accepts both statuses', () => {
    const result = applyStatusToList(
      activeListMock,
      ['ACCEPTED', 'PREPARING'],
      preparingOrderMock,
      'ACCEPTED'
    )
    expect(result.pages[0].data[0].status).toBe('ACCEPTED')
    expect(result.pages[0].data).toHaveLength(2)
  })

  it('never duplicates the order it just moved', () => {
    const result = applyStatusToList(
      activeListMock,
      null,
      preparingOrderMock,
      'ACCEPTED'
    )
    const matches = result.pages[0].data.filter(
      ({ id }) => id === preparingOrderMock.id
    )
    expect(matches).toHaveLength(1)
  })

  it('accepts the order when the trail filters no status at all', () => {
    const result = applyStatusToList(
      finishedListMock,
      null,
      preparingOrderMock,
      'COMPLETED'
    )
    expect(result.pages[0].data).toHaveLength(1)
  })
})

describe('statusesFromKey', () => {
  it('reads the comma separated filter the key carries', () => {
    expect(statusesFromKey('ACCEPTED,PREPARING')).toEqual([
      'ACCEPTED',
      'PREPARING',
    ])
  })

  it('reads no filter from an unfiltered query', () => {
    expect(statusesFromKey(undefined)).toBeNull()
    expect(statusesFromKey('')).toBeNull()
  })
})

describe('findOrderInLists', () => {
  it('finds the order in whichever trail currently holds it', () => {
    const found = findOrderInLists([finishedListMock, activeListMock], 'order-1')
    expect(found).toEqual(preparingOrderMock)
  })

  it('finds nothing when no trail holds the order', () => {
    expect(findOrderInLists([finishedListMock], 'order-1')).toBeNull()
  })
})
