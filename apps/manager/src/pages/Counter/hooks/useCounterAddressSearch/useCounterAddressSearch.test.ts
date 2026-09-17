import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CounterAddressSearchService } from '@pages/Counter/services/counter-address-search.service/counter-address-search.service'

import { useCounterAddressSearch } from './useCounterAddressSearch'
import { addressSuggestionsMock } from './useCounterAddressSearch.mock'

vi.mock(
  '@pages/Counter/services/counter-address-search.service/counter-address-search.service',
  () => ({
    CounterAddressSearchService: { search: vi.fn() },
  })
)

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useCounterAddressSearch.name, () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('collapses rapid street changes into one request', async () => {
    vi.useFakeTimers()
    vi.mocked(CounterAddressSearchService.search).mockResolvedValue(
      addressSuggestionsMock
    )
    const { result, rerender } = renderHook(
      ({ street, state, deliveryCities }) =>
        useCounterAddressSearch(street, state, deliveryCities),
      {
        initialProps: {
          street: 'Rua d',
          state: 'pa',
          deliveryCities: [{ city: 'Belém', state: 'PA' }],
        },
        wrapper,
      }
    )
    expect(CounterAddressSearchService.search).not.toHaveBeenCalled()
    expect(result.current.isSearching).toBe(true)

    act(() => vi.advanceTimersByTime(300))
    rerender({
      street: 'Rua das',
      state: 'pa',
      deliveryCities: [{ city: 'Belém', state: 'PA' }],
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
        'Rua das',
        'PA',
        undefined
      )
    )
    expect(CounterAddressSearchService.search).toHaveBeenCalledTimes(1)
  })

  it('keeps only suggestions in the configured delivery cities', async () => {
    vi.mocked(CounterAddressSearchService.search).mockResolvedValue([
      addressSuggestionsMock[0],
      { ...addressSuggestionsMock[0], id: 'address-2', city: 'Ananindeua' },
    ])

    const { result } = renderHook(
      () =>
        useCounterAddressSearch('Rua das', 'PA', [
          { city: 'Belém', state: 'PA' },
        ]),
      { wrapper }
    )

    await waitFor(() =>
      expect(CounterAddressSearchService.search).toHaveBeenCalledWith(
        'Rua das',
        'PA',
        undefined
      )
    )
    await waitFor(() =>
      expect(result.current.suggestions).toEqual([addressSuggestionsMock[0]])
    )
  })
})
