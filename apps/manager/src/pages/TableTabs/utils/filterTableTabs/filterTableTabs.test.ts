import { describe, expect, it } from 'vitest'

import { filterTableTabs } from './filterTableTabs'
import { tableTabSearchOrdersMock } from './filterTableTabs.mock'

describe('filterTableTabs', () => {
  it('filters comandas by customer name without case sensitivity', () => {
    expect(filterTableTabs(tableTabSearchOrdersMock, 'ana')).toEqual([
      tableTabSearchOrdersMock[0],
    ])
  })

  it('filters comandas by table', () => {
    expect(filterTableTabs(tableTabSearchOrdersMock, '12')).toEqual([
      tableTabSearchOrdersMock[1],
    ])
  })

  it('filters comandas by order number', () => {
    expect(filterTableTabs(tableTabSearchOrdersMock, '42')).toEqual([
      tableTabSearchOrdersMock[0],
    ])
  })

  it('keeps all comandas when the search is blank', () => {
    expect(filterTableTabs(tableTabSearchOrdersMock, '  ')).toBe(
      tableTabSearchOrdersMock
    )
  })
})
