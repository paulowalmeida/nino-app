import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import { useCreateOrder } from '@shared/hooks/order/useCreateOrder/useCreateOrder'

import { useCounterSale } from './useCounterSale'

vi.mock('@shared/hooks/order/useCreateOrder/useCreateOrder', () => ({
  useCreateOrder: vi.fn(),
}))

describe(useCounterSale.name, () => {
  it('requires a consumer name', async () => {
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never)
    const { result } = renderHook(() => useCounterSale('unit-1'))
    await act(() =>
      result.current.sell({
        lines: [],
        paymentMethod: 'CASH',
        consumerName: '',
      })
    )
    expect(result.current.error).toContain('nome de quem pediu')
  })

  it('returns the created order id, number, and pickup code', async () => {
    const mutateAsync = vi
      .fn()
      .mockResolvedValue({ id: 'order-7', orderNumber: 7 })
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateOrder>)
    const { result } = renderHook(() => useCounterSale('unit-1'))
    const sale = await act(() =>
      result.current.sell({
        lines: [],
        paymentMethod: 'CASH',
        consumerName: 'Ana',
      })
    )
    expect(sale).toEqual({ id: 'order-7', orderNumber: 7 })
  })

  it('accepts delivery sales identified by the recipient name', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({ orderNumber: 8 })
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never)
    const { result } = renderHook(() => useCounterSale('unit-1'))

    await act(() =>
      result.current.sell({
        lines: [],
        channel: 'DELIVERY',
        paymentMethod: 'PIX',
        consumerName: '',
        recipient: {
          name: 'Ana',
          phone: '91999999999',
          street: 'Rua A',
          number: '10',
          complement: '',
          neighborhood: 'Centro',
          zoneId: 'zone-1',
        },
      })
    )

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'DELIVERY',
        guestName: 'Ana',
        deliveryZoneId: 'zone-1',
      })
    )
  })

  it('translates API errors and resets them', async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new Error('failed'))
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never)
    const { result } = renderHook(() => useCounterSale('unit-1'))
    await act(() =>
      result.current.sell({
        lines: [],
        paymentMethod: 'CASH',
        consumerName: 'Ana',
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
    const { result } = renderHook(() => useCounterSale('unit-1'))
    await act(() =>
      result.current.sell({
        lines: [],
        paymentMethod: 'CASH',
        consumerName: 'Ana',
      })
    )
    expect(result.current.error).toBe('E-mail inválido')
  })
})
