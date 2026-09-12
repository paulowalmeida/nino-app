import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ConsumerService } from '@shared/services/consumer/consumer.service'

import { useConsumerDetail } from './useConsumerDetail'
import {
  consumerDetailMock,
  consumerDetailScopeMock,
} from './useConsumerDetail.mock'

vi.mock('@shared/services/consumer/consumer.service', () => ({
  ConsumerService: { getById: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe('useConsumerDetail', () => {
  afterEach(() => vi.clearAllMocks())

  it('loads the consumer and adapts its addresses', async () => {
    vi.mocked(ConsumerService.getById).mockResolvedValue(consumerDetailMock)

    const { result } = renderHook(
      () =>
        useConsumerDetail(
          consumerDetailScopeMock.tenantId,
          consumerDetailScopeMock.consumerId
        ),
      { wrapper }
    )

    await waitFor(() => expect(result.current.consumer).toBeDefined())
    expect(ConsumerService.getById).toHaveBeenCalledWith(
      consumerDetailScopeMock.tenantId,
      consumerDetailScopeMock.consumerId
    )
    expect(result.current.addressRows).toHaveLength(1)
    expect(result.current.addressRows[0].streetLine).toBe('Rua Olimpíadas, 55')
  })

  it('does not request without tenant or consumer scope', () => {
    const { result } = renderHook(() => useConsumerDetail(null, ''), {
      wrapper,
    })

    expect(ConsumerService.getById).not.toHaveBeenCalled()
    expect(result.current.consumer).toBeUndefined()
    expect(result.current.addressRows).toEqual([])
  })
})
