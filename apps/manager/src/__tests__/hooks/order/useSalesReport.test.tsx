import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSalesReport } from '@hooks/order/useSalesReport'
import { OrderService } from '@services/order.service'

import { salesReport, weekRange } from './useSalesReport.mock'

vi.mock('@services/order.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSalesReport.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('exposes the report for the given period', async () => {
    // Arrange
    vi.mocked(OrderService.getSalesReport).mockResolvedValue(salesReport)

    // Act
    const { result } = renderHook(
      () => useSalesReport('tenant-1', weekRange),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() => expect(result.current.report).toEqual(salesReport))
    expect(OrderService.getSalesReport).toHaveBeenCalledWith(
      'tenant-1',
      weekRange
    )
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(() => useSalesReport(null, weekRange), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(OrderService.getSalesReport).not.toHaveBeenCalled()
  })
})
