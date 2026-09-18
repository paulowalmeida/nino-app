import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'
import { downloadSaleReceipt } from '@shared/utils/downloadSaleReceipt/downloadSaleReceipt'

import { useOrderReceipt } from './useOrderReceipt'
import { orderReceiptMock } from './useOrderReceipt.mock'

vi.mock('@shared/services/order/order.service')
vi.mock('@shared/utils/downloadSaleReceipt/downloadSaleReceipt')

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(
    QueryClientProvider,
    {
      client: new QueryClient({
        defaultOptions: { mutations: { retry: false } },
      }),
    },
    children
  )

describe(useOrderReceipt.name, () => {
  it('downloads the receipt PDF for the given order', async () => {
    // Arrange
    const pdf = new Blob(['%PDF-1.4'], { type: 'application/pdf' })
    vi.mocked(OrderService.downloadReceipt).mockResolvedValue(pdf)
    const { result } = renderHook(() => useOrderReceipt('unit-1'), {
      wrapper,
    })

    // Act
    act(() => result.current.downloadReceipt(orderReceiptMock))

    // Assert
    await waitFor(() =>
      expect(OrderService.downloadReceipt).toHaveBeenCalledWith(
        'unit-1',
        orderReceiptMock.id
      )
    )
    await waitFor(() =>
      expect(downloadSaleReceipt).toHaveBeenCalledWith(pdf, 'recibo-128.pdf')
    )
  })
})
