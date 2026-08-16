import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSalesSeriesByChannel } from '@hooks/order/useSalesSeriesByChannel'
import { OrderService } from '@services/order.service'

import { salesSeriesByChannel, weekRange } from './useSalesSeriesByChannel.mock'

vi.mock('@services/order.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSalesSeriesByChannel.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('exposes the breakdown for the given period and granularity', async () => {
    // Arrange
    vi.mocked(OrderService.getSalesSeriesByChannel).mockResolvedValue(
      salesSeriesByChannel
    )

    // Act
    const { result } = renderHook(
      () => useSalesSeriesByChannel('tenant-1', weekRange, 'day'),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() =>
      expect(result.current.breakdown).toEqual(salesSeriesByChannel)
    )
    expect(OrderService.getSalesSeriesByChannel).toHaveBeenCalledWith(
      'tenant-1',
      weekRange,
      'day'
    )
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(
      () => useSalesSeriesByChannel(null, weekRange, 'day'),
      { wrapper: wrapWithClient() }
    )

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(OrderService.getSalesSeriesByChannel).not.toHaveBeenCalled()
  })
})
