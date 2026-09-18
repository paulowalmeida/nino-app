import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CounterAddressSearchService } from '@pages/Counter/services/counter-address-search.service/counter-address-search.service'

import { useCounterAddressSearch } from './useCounterAddressSearch'
import {
  addressPredictionsMock,
  addressSearchResultMock,
} from './useCounterAddressSearch.mock'

vi.mock(
  '@pages/Counter/services/counter-address-search.service/counter-address-search.service',
  () => ({
    CounterAddressSearchService: { search: vi.fn(), details: vi.fn() },
  })
)

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useCounterAddressSearch.name, () => {
  beforeEach(() => {
    let sessionTokenCount = 0
    vi.stubGlobal('crypto', {
      randomUUID: () => `session-${++sessionTokenCount}`,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('collapses rapid street changes into one request', async () => {
    vi.useFakeTimers()
    vi.mocked(CounterAddressSearchService.search).mockResolvedValue(
      addressPredictionsMock
    )
    const { result, rerender } = renderHook(
      ({ unitId, street, state }) =>
        useCounterAddressSearch(unitId, street, state),
      {
        initialProps: {
          unitId: 'unit-1',
          street: 'Rua d',
          state: 'pa',
        },
        wrapper,
      }
    )
    expect(CounterAddressSearchService.search).not.toHaveBeenCalled()
    expect(result.current.isSearching).toBe(true)

    act(() => vi.advanceTimersByTime(300))
    rerender({
      unitId: 'unit-1',
      street: 'Rua das',
      state: 'pa',
    })

    await act(async () => {
      vi.advanceTimersByTime(599)
      await Promise.resolve()
    })
    expect(CounterAddressSearchService.search).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(1)
      await Promise.resolve()
    })
    vi.useRealTimers()
    await waitFor(() =>
      expect(CounterAddressSearchService.search).toHaveBeenCalledWith(
        'unit-1',
        'Rua das',
        'PA',
        'session-1'
      )
    )
    expect(CounterAddressSearchService.search).toHaveBeenCalledTimes(1)
  })

  it('returns the BFF predictions for the active search', async () => {
    vi.mocked(CounterAddressSearchService.search).mockResolvedValue([
      addressPredictionsMock[0],
      { ...addressPredictionsMock[0], placeId: 'place-2' },
    ])

    const { result } = renderHook(
      () => useCounterAddressSearch('unit-1', 'Rua das', 'PA'),
      { wrapper }
    )

    await waitFor(() =>
      expect(CounterAddressSearchService.search).toHaveBeenCalledWith(
        'unit-1',
        'Rua das',
        'PA',
        'session-1'
      )
    )
    await waitFor(() =>
      expect(result.current.suggestions).toEqual([
        addressPredictionsMock[0],
        { ...addressPredictionsMock[0], placeId: 'place-2' },
      ])
    )
  })

  it('resolves a selected prediction and rotates the session token afterwards', async () => {
    vi.mocked(CounterAddressSearchService.search).mockResolvedValue(
      addressPredictionsMock
    )
    vi.mocked(CounterAddressSearchService.details).mockResolvedValue(
      addressSearchResultMock
    )

    const { result } = renderHook(
      () => useCounterAddressSearch('unit-1', 'Rua das', 'PA'),
      { wrapper }
    )
    await waitFor(() =>
      expect(CounterAddressSearchService.search).toHaveBeenCalled()
    )

    // Act: resolve the prediction the guest selected, using the session
    // token the search above opened.
    await act(async () => {
      await result.current.resolveSelectedAddress('place-1')
    })

    // Assert: the details call closed the same session the search opened,
    // and a new search afterwards opens a different one.
    expect(CounterAddressSearchService.details).toHaveBeenCalledWith(
      'unit-1',
      'place-1',
      'session-1'
    )
    await waitFor(() =>
      expect(CounterAddressSearchService.search).toHaveBeenLastCalledWith(
        'unit-1',
        'Rua das',
        'PA',
        'session-2'
      )
    )
  })
})
