import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useConsumersStore } from './consumers.store'
import { consumersStoreMock } from './consumers.store.mock'

describe('useConsumersStore', () => {
  beforeEach(() => {
    act(() => useConsumersStore.getState().setSearch(''))
  })

  it('starts with no search term', () => {
    expect(useConsumersStore.getState().search).toBe(
      consumersStoreMock.initialSearch
    )
  })

  it('keeps the term the search box last committed', () => {
    act(() => useConsumersStore.getState().setSearch(consumersStoreMock.term))

    expect(useConsumersStore.getState().search).toBe(consumersStoreMock.term)
  })

  it('clears the term back to the whole base', () => {
    act(() => useConsumersStore.getState().setSearch(consumersStoreMock.term))
    act(() => useConsumersStore.getState().setSearch(''))

    expect(useConsumersStore.getState().search).toBe('')
  })
})
