import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
  it('debounces the street before searching', async () => {
    vi.useFakeTimers()
    vi.mocked(CounterAddressSearchService.search).mockResolvedValue(
      addressSuggestionsMock
    )
    const { result } = renderHook(
      ({ street }) => useCounterAddressSearch(street),
      { initialProps: { street: 'Rua das' }, wrapper }
    )
    expect(CounterAddressSearchService.search).not.toHaveBeenCalled()
    expect(result.current.isSearching).toBe(true)
    await act(async () => {
      vi.advanceTimersByTime(350)
      await Promise.resolve()
    })
    vi.useRealTimers()
    await waitFor(() =>
      expect(CounterAddressSearchService.search).toHaveBeenCalledWith('Rua das')
    )
  })
})
