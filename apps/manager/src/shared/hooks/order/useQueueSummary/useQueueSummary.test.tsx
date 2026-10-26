import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useQueueSummary } from './useQueueSummary'
import { queueSummaryMock } from './useQueueSummary.mock'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { getQueueSummary: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useQueueSummary.name, () => {
  it('queries the summary only for a selected unit', async () => {
    vi.mocked(OrderService.getQueueSummary).mockResolvedValue(queueSummaryMock)
    const { result } = renderHook(() => useQueueSummary('unit-1'), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual(queueSummaryMock))
    expect(OrderService.getQueueSummary).toHaveBeenCalledWith('unit-1')
  })

  it('stays disabled without a unit', () => {
    const { result } = renderHook(() => useQueueSummary(null), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })
})
