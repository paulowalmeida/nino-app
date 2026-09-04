import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { availabilityMock } from './useCounterAvailability.mock'
import { useCounterAvailability } from './useCounterAvailability'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { getAvailability: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useCounterAvailability.name, () => {
  it('maps zones and exposes address and cities', async () => {
    vi.mocked(OrderService.getAvailability).mockResolvedValue(
      availabilityMock as never
    )
    const { result } = renderHook(
      () => useCounterAvailability('tenant-1', 'zone-1'),
      { wrapper }
    )
    await waitFor(() => expect(result.current.zones).toHaveLength(1))
    expect(result.current.fee).toBe(7.5)
    expect(result.current.storeAddress).toEqual(availabilityMock.storeAddress)
    expect(result.current.deliveryCities).toEqual(
      availabilityMock.deliveryCities
    )
  })
})
