import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { checkoutAddressSearchService } from '@pages/Checkout/services/address-search/address-search.service/address-search.service'

import { useGuestAddressSearch } from './useGuestAddressSearch'
import {
  guestAddressPredictionsMock,
  guestAddressSearchResultMock,
} from './useGuestAddressSearch.mock'

vi.mock(
  '@pages/Checkout/services/address-search/address-search.service/address-search.service',
  () => ({
    checkoutAddressSearchService: { search: vi.fn(), details: vi.fn() },
  })
)

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe(useGuestAddressSearch.name, () => {
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

  it('debounces street+number and searches the BFF once requested', async () => {
    vi.useFakeTimers()
    vi.mocked(checkoutAddressSearchService.search).mockResolvedValue(
      guestAddressPredictionsMock
    )
    renderHook(
      () =>
        useGuestAddressSearch('unit-1', 'pa', 'Rua das Flores', '123', true),
      { wrapper: createWrapper() }
    )

    expect(checkoutAddressSearchService.search).not.toHaveBeenCalled()
    await act(async () => {
      vi.advanceTimersByTime(600)
      await Promise.resolve()
    })
    vi.useRealTimers()

    await waitFor(() =>
      expect(checkoutAddressSearchService.search).toHaveBeenCalledWith(
        'unit-1',
        'Rua das Flores, 123',
        'pa',
        'session-1'
      )
    )
  })

  it('does not search while the address lookup was not requested', async () => {
    const { result } = renderHook(
      () =>
        useGuestAddressSearch('unit-1', 'PA', 'Rua das Flores', '123', false),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.suggestions).toEqual([]))
    expect(checkoutAddressSearchService.search).not.toHaveBeenCalled()
  })

  it('does not search until street and number are both filled', async () => {
    const { result } = renderHook(
      () => useGuestAddressSearch('unit-1', 'PA', 'Rua das Flores', '', true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.suggestions).toEqual([]))
    expect(checkoutAddressSearchService.search).not.toHaveBeenCalled()
  })

  it('resolves a selected prediction and rotates the session token afterwards', async () => {
    vi.mocked(checkoutAddressSearchService.search).mockResolvedValue(
      guestAddressPredictionsMock
    )
    vi.mocked(checkoutAddressSearchService.details).mockResolvedValue(
      guestAddressSearchResultMock
    )

    const { result } = renderHook(
      () =>
        useGuestAddressSearch('unit-1', 'PA', 'Rua das Flores', '123', true),
      { wrapper: createWrapper() }
    )
    await waitFor(() =>
      expect(checkoutAddressSearchService.search).toHaveBeenCalled()
    )

    // Act: resolve the prediction the guest selected, using the session
    // token the search above opened.
    await act(async () => {
      await result.current.resolveSelectedAddress('place-1')
    })

    // Assert: the details call closed the same session the search opened.
    expect(checkoutAddressSearchService.details).toHaveBeenCalledWith(
      'unit-1',
      'place-1',
      'session-1'
    )
  })
})
