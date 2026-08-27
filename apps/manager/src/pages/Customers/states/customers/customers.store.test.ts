import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCustomersStore } from './customers.store'
import { customersStoreMock } from './customers.store.mock'

describe('useCustomersStore', () => {
  beforeEach(() => {
    act(() => useCustomersStore.getState().setSearch(''))
  })

  it('starts with no search term', () => {
    expect(useCustomersStore.getState().search).toBe(
      customersStoreMock.initialSearch
    )
  })

  it('keeps the term the search box last committed', () => {
    act(() => useCustomersStore.getState().setSearch(customersStoreMock.term))

    expect(useCustomersStore.getState().search).toBe(customersStoreMock.term)
  })

  it('clears the term back to the whole base', () => {
    act(() => useCustomersStore.getState().setSearch(customersStoreMock.term))
    act(() => useCustomersStore.getState().setSearch(''))

    expect(useCustomersStore.getState().search).toBe('')
  })
})
