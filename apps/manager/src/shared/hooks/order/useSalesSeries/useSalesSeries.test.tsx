import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useSalesSeries } from './useSalesSeries'
import { salesSeriesHookMock, salesSeriesParamsMock } from './useSalesSeries.mock'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { getSalesSeries: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useSalesSeries.name, () => {
  it('exposes the series from query data', async () => {
    vi.mocked(OrderService.getSalesSeries).mockResolvedValue(salesSeriesHookMock)
    const { result } = renderHook(() => useSalesSeries('unit-1', salesSeriesParamsMock, 'day'), { wrapper })
    await waitFor(() => expect(result.current.series).toEqual(salesSeriesHookMock))
    expect(OrderService.getSalesSeries).toHaveBeenCalledWith('unit-1', salesSeriesParamsMock, 'day')
  })
})
