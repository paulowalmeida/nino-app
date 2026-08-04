import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTimingReport } from '@hooks/order/useTimingReport'
import { OrderService } from '@services/order.service'

import { timingReport, weekRange } from './useTimingReport.mock'

vi.mock('@services/order.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useTimingReport.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('exposes the timing report for the given period', async () => {
    // Arrange
    vi.mocked(OrderService.getTimingReport).mockResolvedValue(timingReport)

    // Act
    const { result } = renderHook(
      () => useTimingReport('tenant-1', weekRange),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() => expect(result.current.report).toEqual(timingReport))
    expect(OrderService.getTimingReport).toHaveBeenCalledWith(
      'tenant-1',
      weekRange
    )
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(() => useTimingReport(null, weekRange), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(OrderService.getTimingReport).not.toHaveBeenCalled()
  })
})
