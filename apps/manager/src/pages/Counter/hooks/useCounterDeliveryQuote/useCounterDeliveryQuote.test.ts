import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useCounterDeliveryQuote } from './useCounterDeliveryQuote'
import {
  counterPointMock,
  counterTypedAddressMock,
  deliveryQuoteMock,
} from './useCounterDeliveryQuote.mock'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { getDeliveryQuote: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useCounterDeliveryQuote.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('quotes by the point picked on Google when there is one', async () => {
    vi.mocked(OrderService.getDeliveryQuote).mockResolvedValue(
      deliveryQuoteMock
    )
    const { result } = renderHook(
      () =>
        useCounterDeliveryQuote('unit-1', {
          ...counterTypedAddressMock,
          ...counterPointMock,
        }),
      { wrapper }
    )
    await waitFor(() => expect(result.current.quote).toEqual(deliveryQuoteMock))
    expect(OrderService.getDeliveryQuote).toHaveBeenCalledWith(
      'unit-1',
      counterPointMock
    )
  })

  it('quotes a typed address for the API to geocode, never by zip code alone', async () => {
    vi.mocked(OrderService.getDeliveryQuote).mockResolvedValue(
      deliveryQuoteMock
    )
    const { result } = renderHook(
      () => useCounterDeliveryQuote('unit-1', counterTypedAddressMock),
      { wrapper }
    )
    await waitFor(() => expect(result.current.quote).toEqual(deliveryQuoteMock))
    expect(OrderService.getDeliveryQuote).toHaveBeenCalledWith(
      'unit-1',
      counterTypedAddressMock
    )
  })

  it('does not quote a zip code without street, number, city and state', () => {
    renderHook(
      () => useCounterDeliveryQuote('unit-1', { zipCode: '66000-000' }),
      { wrapper }
    )
    expect(OrderService.getDeliveryQuote).not.toHaveBeenCalled()
  })
})
