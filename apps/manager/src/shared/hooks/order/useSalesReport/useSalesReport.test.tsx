import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useSalesReport } from './useSalesReport'
import { salesReportHookMock, salesReportParamsMock } from './useSalesReport.mock'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { getSalesReport: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useSalesReport.name, () => {
  it('exposes the report from query data', async () => {
    vi.mocked(OrderService.getSalesReport).mockResolvedValue(salesReportHookMock)
    const { result } = renderHook(() => useSalesReport('unit-1', salesReportParamsMock), { wrapper })
    await waitFor(() => expect(result.current.report).toEqual(salesReportHookMock))
  })
})
