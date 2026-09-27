import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'

import { useDeliveryQuote } from './useDeliveryQuote'

vi.mock('@pages/Checkout/services/delivery-zone/delivery-zone.service', () => ({
  deliveryZoneService: { getQuote: vi.fn() },
}))

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useDeliveryQuote', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('quotes with the resolved zip code and coordinates', async () => {
    const quote = {
      id: 'zone-1',
      name: 'Centro',
      fee: '6.50',
      minRadiusKm: 0,
      maxRadiusKm: 3,
    }
    vi.mocked(deliveryZoneService.getQuote).mockResolvedValue(quote)

    const { result } = renderHook(
      () =>
        useDeliveryQuote('unit-1', {
          providerId: 'place-1',
          zipCode: '66000-000',
          latitude: -1.45,
          longitude: -48.5,
        }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.quote).toEqual(quote))
    expect(deliveryZoneService.getQuote).toHaveBeenCalledWith(
      'unit-1',
      '66000000',
      { latitude: -1.45, longitude: -48.5 }
    )
  })

  it('does not requote when only unrelated address text changes', async () => {
    // Arrange: a quote already resolved for this zip/coordinate pair.
    vi.mocked(deliveryZoneService.getQuote).mockResolvedValue({
      id: 'zone-1',
      name: 'Centro',
      fee: '6.50',
      minRadiusKm: 0,
      maxRadiusKm: 3,
    })
    const wrapper = createWrapper()
    const { result, rerender } = renderHook(
      ({ providerId }: { providerId: string }) =>
        useDeliveryQuote('unit-1', {
          providerId,
          zipCode: '66000-000',
          latitude: -1.45,
          longitude: -48.5,
        }),
      { initialProps: { providerId: 'place-1' }, wrapper }
    )
    await waitFor(() =>
      expect(deliveryZoneService.getQuote).toHaveBeenCalledTimes(1)
    )

    // Act: the zip/coordinates stay the same — nothing that reaches the
    // backend request actually changed.
    rerender({ providerId: 'place-1' })

    // Assert: no second request fired.
    await waitFor(() => expect(result.current.quote).toBeDefined())
    expect(deliveryZoneService.getQuote).toHaveBeenCalledTimes(1)
  })

  it('does not quote without a zip code or coordinates', () => {
    const { result } = renderHook(
      () => useDeliveryQuote('unit-1', { providerId: undefined }),
      { wrapper: createWrapper() }
    )

    expect(result.current.quote).toBeUndefined()
    expect(deliveryZoneService.getQuote).not.toHaveBeenCalled()
  })
})
