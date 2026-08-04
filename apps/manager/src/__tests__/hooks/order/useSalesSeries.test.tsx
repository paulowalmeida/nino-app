import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSalesSeries } from '@hooks/order/useSalesSeries'
import { OrderService } from '@services/order.service'

import { salesSeries, weekRange } from './useSalesSeries.mock'

vi.mock('@services/order.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSalesSeries.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('exposes the series for the given period and granularity', async () => {
    // Arrange
    vi.mocked(OrderService.getSalesSeries).mockResolvedValue(salesSeries)

    // Act
    const { result } = renderHook(
      () => useSalesSeries('tenant-1', weekRange, 'day'),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() => expect(result.current.series).toEqual(salesSeries))
    expect(OrderService.getSalesSeries).toHaveBeenCalledWith(
      'tenant-1',
      weekRange,
      'day'
    )
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(
      () => useSalesSeries(null, weekRange, 'day'),
      { wrapper: wrapWithClient() }
    )

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(OrderService.getSalesSeries).not.toHaveBeenCalled()
  })
})
