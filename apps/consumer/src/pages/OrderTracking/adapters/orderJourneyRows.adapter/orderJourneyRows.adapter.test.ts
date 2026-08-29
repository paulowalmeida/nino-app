import { describe, expect, it } from 'vitest'
import { orderJourneyRows } from './orderJourneyRows.adapter'
import { orderJourneyRowsMock } from './orderJourneyRows.adapter.mock'
describe('orderJourneyRows', () => {
  it('returns no future rows for a cancelled order without history', () => {
    expect(orderJourneyRows(orderJourneyRowsMock.order as never)).toEqual([])
  })
})
