import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { searchAddress } from '@nino/lib/services/zip-code.service'

import { addressSuggestionsMock } from './useCounterAddressSearch.mock'
import { useCounterAddressSearch } from './useCounterAddressSearch'

vi.mock('@nino/lib/services/zip-code.service', () => ({
  searchAddress: vi.fn(),
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useCounterAddressSearch.name, () => {
  it('debounces the street before searching', async () => {
    vi.useFakeTimers()
    vi.mocked(searchAddress).mockResolvedValue(addressSuggestionsMock)
    const { result } = renderHook(
      ({ street }) => useCounterAddressSearch('Belém', 'PA', street),
      { initialProps: { street: 'Rua das' }, wrapper }
    )
    expect(searchAddress).not.toHaveBeenCalled()
    expect(result.current.isSearching).toBe(true)
    await act(async () => {
      vi.advanceTimersByTime(350)
      await Promise.resolve()
    })
    vi.useRealTimers()
    await waitFor(() =>
      expect(searchAddress).toHaveBeenCalledWith('PA', 'Belém', 'Rua das')
    )
  })
})
