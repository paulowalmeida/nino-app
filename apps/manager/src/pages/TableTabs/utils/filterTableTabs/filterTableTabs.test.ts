import { describe, expect, it } from 'vitest'

import { filterTableTabs } from './filterTableTabs'
import { filterTableTabsMock } from './filterTableTabs.mock'

describe('filterTableTabs', () => {
  it('returns every tab when the term is blank', () => {
    expect(filterTableTabs(filterTableTabsMock.tabs, '   ')).toEqual(
      filterTableTabsMock.tabs
    )
  })

  it('matches the label ignoring case and surrounding spaces', () => {
    expect(
      filterTableTabs(filterTableTabsMock.tabs, '  mesa ').map(
        ({ label }) => label
      )
    ).toEqual(['Mesa 4', 'MESA 12'])
  })

  it('returns nothing when no label matches', () => {
    expect(filterTableTabs(filterTableTabsMock.tabs, 'bruno')).toEqual([])
  })
})
