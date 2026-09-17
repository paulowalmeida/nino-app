import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'

import { useDeliveryQuote } from './useDeliveryQuote'

vi.mock('@pages/Checkout/services/delivery-zone/delivery-zone.service', () => ({
  deliveryZoneService: { getQuote: vi.fn() },
}))

describe('useDeliveryQuote', () => {
  it('quotes with coordinates and refetches when the edited address changes', async () => {
    const quote = {
      id: 'zone-1',
      name: 'Centro',
      fee: '6.50',
      minRadiusKm: 0,
      maxRadiusKm: 3,
    }
    vi.mocked(deliveryZoneService.getQuote).mockResolvedValue(quote)
    const queryClient = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children)

    const { result, rerender } = renderHook(
      ({ street }) =>
        useDeliveryQuote('unit-1', {
          providerId: 'place-1',
          zipCode: '66000-000',
          street,
          latitude: -1.45,
          longitude: -48.5,
        }),
      { initialProps: { street: 'Rua das Flores' }, wrapper }
    )

    await waitFor(() => expect(result.current.quote).toEqual(quote))
    expect(deliveryZoneService.getQuote).toHaveBeenCalledWith(
      'unit-1',
      '66000000',
      { latitude: -1.45, longitude: -48.5 }
    )

    rerender({ street: 'Rua Nova' })
    await waitFor(() =>
      expect(deliveryZoneService.getQuote).toHaveBeenCalledTimes(2)
    )
  })
})
