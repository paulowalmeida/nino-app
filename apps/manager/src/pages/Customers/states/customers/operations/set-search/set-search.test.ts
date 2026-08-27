import { describe, expect, it, vi } from 'vitest'

import { setSearch } from './set-search'
import { setSearchMock } from './set-search.mock'

describe('setSearch', () => {
  it('writes the term into the customers state', () => {
    const set = vi.fn()

    setSearch(set, setSearchMock.term)

    expect(set).toHaveBeenCalledWith({ search: setSearchMock.term })
  })

  it('writes the cleared term back', () => {
    const set = vi.fn()

    setSearch(set, setSearchMock.cleared)

    expect(set).toHaveBeenCalledWith({ search: '' })
  })
})
