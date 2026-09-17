import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { checkoutAddressSearchService } from '@pages/Checkout/services/address-search/address-search.service/address-search.service'

import { useGuestAddressSearch } from './useGuestAddressSearch'
import { guestAddressSearchResultsMock } from './useGuestAddressSearch.mock'

vi.mock(
  '@pages/Checkout/services/address-search/address-search.service/address-search.service',
  () => ({ checkoutAddressSearchService: { search: vi.fn() } })
)

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe(useGuestAddressSearch.name, () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('debounces the street and searches the BFF with city and state context', async () => {
    vi.useFakeTimers()
    vi.mocked(checkoutAddressSearchService.search).mockResolvedValue(
      guestAddressSearchResultsMock
    )
    renderHook(() => useGuestAddressSearch('Belém', 'pa', 'Rua das'), {
      wrapper: createWrapper(),
    })

    expect(checkoutAddressSearchService.search).not.toHaveBeenCalled()
    await act(async () => {
      vi.advanceTimersByTime(350)
      await Promise.resolve()
    })
    vi.useRealTimers()

    await waitFor(() =>
      expect(checkoutAddressSearchService.search).toHaveBeenCalledWith(
        'Rua das',
        'pa',
        'Belém'
      )
    )
  })

  it('does not search until the street has three characters and a state', async () => {
    const { result } = renderHook(
      () => useGuestAddressSearch('Belém', 'PA', 'Ru'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.suggestions).toEqual([]))
    expect(checkoutAddressSearchService.search).not.toHaveBeenCalled()
  })
})
