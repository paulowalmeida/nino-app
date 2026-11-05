import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { deliveryZoneService } from '@pages/Checkout/services/delivery-zone/delivery-zone.service'

import { useDeliveryQuote } from './useDeliveryQuote'
import {
  guestPointMock,
  quoteMock,
  savedAddressMock,
} from './useDeliveryQuote.mock'

vi.mock('@pages/Checkout/services/delivery-zone/delivery-zone.service', () => ({
  deliveryZoneService: { getQuote: vi.fn() },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useDeliveryQuote', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('quotes a guest by the point picked on Google', async () => {
    vi.mocked(deliveryZoneService.getQuote).mockResolvedValue(quoteMock)

    const { result } = renderHook(
      () => useDeliveryQuote('unit-1', guestPointMock),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.quote).toEqual(quoteMock))
    expect(deliveryZoneService.getQuote).toHaveBeenCalledWith(
      'unit-1',
      guestPointMock
    )
  })

  it('quotes a signed-in customer by the saved address, with no zip-code lookup', async () => {
    vi.mocked(deliveryZoneService.getQuote).mockResolvedValue(quoteMock)

    const { result } = renderHook(
      () => useDeliveryQuote('unit-1', savedAddressMock),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.quote).toEqual(quoteMock))
    expect(deliveryZoneService.getQuote).toHaveBeenCalledWith(
      'unit-1',
      savedAddressMock
    )
  })

  it('does not requote the same destination', async () => {
    vi.mocked(deliveryZoneService.getQuote).mockResolvedValue(quoteMock)
    const { result, rerender } = renderHook(
      () => useDeliveryQuote('unit-1', { ...guestPointMock }),
      { wrapper: createWrapper() }
    )
    await waitFor(() =>
      expect(deliveryZoneService.getQuote).toHaveBeenCalledTimes(1)
    )

    rerender()

    await waitFor(() => expect(result.current.quote).toBeDefined())
    expect(deliveryZoneService.getQuote).toHaveBeenCalledTimes(1)
  })

  it('does not quote before there is a destination', () => {
    const { result } = renderHook(() => useDeliveryQuote('unit-1', undefined), {
      wrapper: createWrapper(),
    })

    expect(result.current.quote).toBeUndefined()
    expect(deliveryZoneService.getQuote).not.toHaveBeenCalled()
  })

  it('exposes a quote error and recovers through refetch without losing destination', async () => {
    vi.mocked(deliveryZoneService.getQuote)
      .mockRejectedValueOnce(new Error('quote unavailable'))
      .mockResolvedValueOnce(quoteMock)

    const { result } = renderHook(
      () => useDeliveryQuote('unit-1', guestPointMock),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.quote).toBeUndefined()

    await act(async () => {
      await result.current.refetch()
    })

    await waitFor(() => expect(result.current.quote).toEqual(quoteMock))
    expect(deliveryZoneService.getQuote).toHaveBeenCalledWith(
      'unit-1',
      guestPointMock
    )
  })
})
