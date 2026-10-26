import { describe, expect, it } from 'vitest'

import { diningTableSeats } from './diningTableSeats'
import { diningTableSeatsMock } from './diningTableSeats.mock'

describe('diningTableSeats', () => {
  it('marks the table that already has an open tab and hides inactive ones', () => {
    expect(
      diningTableSeats(
        diningTableSeatsMock.tables,
        diningTableSeatsMock.activeTabs
      )
    ).toEqual([
      { id: 'table-4', name: 'Mesa 4', openTabId: 'tab-1' },
      { id: 'table-5', name: 'Mesa 5', openTabId: null },
    ])
  })

  it('returns no seats when the store has no tables', () => {
    expect(diningTableSeats([], diningTableSeatsMock.activeTabs)).toEqual([])
  })
})
