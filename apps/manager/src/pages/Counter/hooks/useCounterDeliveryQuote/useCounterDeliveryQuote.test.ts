import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useCounterDeliveryQuote } from './useCounterDeliveryQuote'
import { deliveryQuoteMock } from './useCounterDeliveryQuote.mock'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { getDeliveryQuote: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useCounterDeliveryQuote.name, () => {
  it('normalizes the zip code and returns the quote', async () => {
    vi.mocked(OrderService.getDeliveryQuote).mockResolvedValue(
      deliveryQuoteMock
    )
    const { result } = renderHook(
      () => useCounterDeliveryQuote('unit-1', { zipCode: '66000-000' }),
      { wrapper }
    )
    await waitFor(() => expect(result.current.quote).toEqual(deliveryQuoteMock))
    expect(OrderService.getDeliveryQuote).toHaveBeenCalledWith(
      'unit-1',
      '66000000',
      { latitude: undefined, longitude: undefined }
    )
  })
})
