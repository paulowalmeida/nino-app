import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ConsumerService } from '@shared/services/consumer/consumer.service'

import { useConsumersList } from './useConsumersList'
import {
  consumersListScopeMock,
  consumersPageMock,
} from './useConsumersList.mock'

vi.mock('@shared/services/consumer/consumer.service', () => ({
  ConsumerService: { listConsumers: vi.fn() },
  CONSUMER_PAGE_SIZE: 30,
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe('useConsumersList', () => {
  afterEach(() => vi.clearAllMocks())

  it('adapts the first page and reports the base total', async () => {
    vi.mocked(ConsumerService.listConsumers).mockResolvedValue(
      consumersPageMock
    )

    const { result } = renderHook(
      () => useConsumersList(consumersListScopeMock.tenantId, ''),
      { wrapper }
    )

    await waitFor(() => expect(result.current.rows).toHaveLength(1))
    expect(result.current.rows[0].name).toBe('Maria Clara Souza')
    expect(result.current.total).toBe(1)
    expect(result.current.hasNextPage).toBe(false)
    expect(ConsumerService.listConsumers).toHaveBeenCalledWith(
      consumersListScopeMock.tenantId,
      1,
      undefined
    )
  })

  it('trims the search term before asking the API', async () => {
    vi.mocked(ConsumerService.listConsumers).mockResolvedValue(
      consumersPageMock
    )

    renderHook(
      () =>
        useConsumersList(
          consumersListScopeMock.tenantId,
          consumersListScopeMock.search
        ),
      { wrapper }
    )

    await waitFor(() =>
      expect(ConsumerService.listConsumers).toHaveBeenCalledWith(
        consumersListScopeMock.tenantId,
        1,
        consumersListScopeMock.trimmedSearch
      )
    )
  })

  it('fetches the following page through the load-more command', async () => {
    vi.mocked(ConsumerService.listConsumers).mockResolvedValue({
      ...consumersPageMock,
      pagination: { total: 60, page: 1, size: 30 },
    })

    const { result } = renderHook(
      () => useConsumersList(consumersListScopeMock.tenantId, ''),
      { wrapper }
    )

    await waitFor(() => expect(result.current.hasNextPage).toBe(true))
    result.current.loadMoreConsumers()
    await waitFor(() =>
      expect(ConsumerService.listConsumers).toHaveBeenLastCalledWith(
        consumersListScopeMock.tenantId,
        2,
        undefined
      )
    )
  })

  it('reports the failure without rows', async () => {
    vi.mocked(ConsumerService.listConsumers).mockRejectedValue(
      new Error('offline')
    )

    const { result } = renderHook(() => useConsumersList('tenant-1', ''), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.rows).toEqual([])
    expect(result.current.total).toBeUndefined()
  })

  it('does not request without a tenant', () => {
    const { result } = renderHook(() => useConsumersList(null, ''), {
      wrapper,
    })

    expect(ConsumerService.listConsumers).not.toHaveBeenCalled()
    expect(result.current.rows).toEqual([])
  })
})
