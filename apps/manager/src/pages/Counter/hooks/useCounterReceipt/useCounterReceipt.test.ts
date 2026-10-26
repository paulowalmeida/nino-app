import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'
import { downloadSaleReceipt } from '@shared/utils/downloadSaleReceipt/downloadSaleReceipt'

import { useCounterReceipt } from './useCounterReceipt'
import { counterReceiptMock } from './useCounterReceipt.mock'

const dismiss = vi.fn()
const state = { lastSale: counterReceiptMock, clearLastSale: dismiss }

vi.mock('@pages/Counter/states/counter/counter.store', () => ({
  useCounterStore: (selector: (value: typeof state) => unknown) =>
    selector(state),
}))
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

describe(useCounterReceipt.name, () => {
  it('exposes the last closed sale for the receipt button', () => {
    const { result } = renderHook(() => useCounterReceipt('unit-1'), {
      wrapper,
    })

    expect(result.current.lastSale).toBe(counterReceiptMock)
  })

  it('exposes the existing dismiss command without wrapping it', () => {
    const { result } = renderHook(() => useCounterReceipt('unit-1'), {
      wrapper,
    })

    expect(result.current.dismissReceipt).toBe(dismiss)
  })

  it('downloads the receipt PDF fetched from the unit order', async () => {
    // Arrange
    const pdf = new Blob(['%PDF-1.4'], { type: 'application/pdf' })
    vi.mocked(OrderService.downloadReceipt).mockResolvedValue(pdf)
    const { result } = renderHook(() => useCounterReceipt('unit-1'), {
      wrapper,
    })

    // Act
    act(() => result.current.downloadReceipt(counterReceiptMock))

    // Assert
    await waitFor(() =>
      expect(OrderService.downloadReceipt).toHaveBeenCalledWith(
        'unit-1',
        counterReceiptMock.orderId
      )
    )
    await waitFor(() =>
      expect(downloadSaleReceipt).toHaveBeenCalledWith(pdf, 'recibo-128.pdf')
    )
  })
})
