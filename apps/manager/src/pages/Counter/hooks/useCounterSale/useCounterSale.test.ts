import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import { useCreateOrder } from '@shared/hooks/order/useCreateOrder/useCreateOrder'

import { useCounterSale } from './useCounterSale'

vi.mock('@shared/hooks/order/useCreateOrder/useCreateOrder', () => ({
  useCreateOrder: vi.fn(),
}))

describe(useCounterSale.name, () => {
  it('requires a customer name', async () => {
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never)
    const { result } = renderHook(() => useCounterSale('tenant-1'))
    await act(() =>
      result.current.sell({
        lines: [],
        paymentMethod: 'CASH',
        customerName: '',
        tableNumber: '',
      })
    )
    expect(result.current.error).toContain('nome de quem pediu')
  })

  it('returns the created order number', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({ orderNumber: 7 })
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never)
    const { result } = renderHook(() => useCounterSale('tenant-1'))
    const orderNumber = await act(() =>
      result.current.sell({
        lines: [],
        paymentMethod: 'CASH',
        customerName: 'Ana',
        tableNumber: '',
      })
    )
    expect(orderNumber).toBe(7)
  })

  it('translates API errors and resets them', async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new Error('failed'))
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never)
    const { result } = renderHook(() => useCounterSale('tenant-1'))
    await act(() =>
      result.current.sell({
        lines: [],
        paymentMethod: 'CASH',
        customerName: 'Ana',
        tableNumber: '',
      })
    )
    expect(result.current.error).toContain('Não foi possível')
    act(() => result.current.reset())
    expect(result.current.error).toBeNull()
  })

  it('preserves a client API error message', async () => {
    const mutateAsync = vi
      .fn()
      .mockRejectedValue(new ApiError(400, 'E-mail inválido'))
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never)
    const { result } = renderHook(() => useCounterSale('tenant-1'))
    await act(() =>
      result.current.sell({
        lines: [],
        paymentMethod: 'CASH',
        customerName: 'Ana',
        tableNumber: '',
      })
    )
    expect(result.current.error).toBe('E-mail inválido')
  })
})
