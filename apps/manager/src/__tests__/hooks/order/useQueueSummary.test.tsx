import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { OrderService } from '@services/order.service'

import { queueSummary } from './useQueueSummary.mock'

vi.mock('@services/order.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useQueueSummary.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the queue summary for the tenant', async () => {
    // Arrange
    vi.mocked(OrderService.getQueueSummary).mockResolvedValue(queueSummary)

    // Act
    const { result } = renderHook(() => useQueueSummary('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(queueSummary))
    expect(OrderService.getQueueSummary).toHaveBeenCalledWith('tenant-1')
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(() => useQueueSummary(null), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(OrderService.getQueueSummary).not.toHaveBeenCalled()
  })
})
