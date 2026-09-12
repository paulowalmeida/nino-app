import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ConsumerService } from '@shared/services/consumer/consumer.service'

import { useConsumerOrderHistory } from './useConsumerOrderHistory'
import {
  consumerOrderHistoryPageMock,
  consumerOrderHistoryScopeMock,
} from './useConsumerOrderHistory.mock'

vi.mock('@shared/services/consumer/consumer.service', () => ({
  ConsumerService: { listConsumerOrders: vi.fn() },
  HISTORY_PAGE_SIZE: 15,
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

const renderHistory = () =>
  renderHook(
    () =>
      useConsumerOrderHistory(
        consumerOrderHistoryScopeMock.tenantId,
        consumerOrderHistoryScopeMock.consumerId
      ),
    { wrapper }
  )

describe('useConsumerOrderHistory', () => {
  afterEach(() => vi.clearAllMocks())

  it('adapts the first history page into order rows', async () => {
    vi.mocked(ConsumerService.listConsumerOrders).mockResolvedValue(
      consumerOrderHistoryPageMock
    )

    const { result } = renderHistory()

    await waitFor(() => expect(result.current.orderRows).toHaveLength(1))
    expect(ConsumerService.listConsumerOrders).toHaveBeenCalledWith(
      consumerOrderHistoryScopeMock.tenantId,
      consumerOrderHistoryScopeMock.consumerId,
      1
    )
    expect(result.current.orderRows[0].statusLabel).toBe('entregue')
    expect(result.current.hasNextPage).toBe(false)
  })

  it('fetches the following page through the load-more command', async () => {
    vi.mocked(ConsumerService.listConsumerOrders).mockResolvedValue({
      ...consumerOrderHistoryPageMock,
      pagination: { total: 30, page: 1, size: 15 },
    })

    const { result } = renderHistory()

    await waitFor(() => expect(result.current.hasNextPage).toBe(true))
    result.current.loadMoreOrders()
    await waitFor(() =>
      expect(ConsumerService.listConsumerOrders).toHaveBeenLastCalledWith(
        consumerOrderHistoryScopeMock.tenantId,
        consumerOrderHistoryScopeMock.consumerId,
        2
      )
    )
  })

  it('does not request without tenant or consumer scope', () => {
    const { result } = renderHook(() => useConsumerOrderHistory(null, ''), {
      wrapper,
    })

    expect(ConsumerService.listConsumerOrders).not.toHaveBeenCalled()
    expect(result.current.orderRows).toEqual([])
  })
})
