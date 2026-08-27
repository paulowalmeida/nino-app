import { useMutation, useQueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useOrderPayment } from './useOrderPayment'
import { useOrderPaymentMock } from './useOrderPayment.mock'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}))
vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { markOrderPaid: vi.fn() },
}))

describe('useOrderPayment', () => {
  it('invalidates tenant orders after payment is confirmed', async () => {
    const invalidateQueries = vi.fn()
    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries,
    } as unknown as ReturnType<typeof useQueryClient>)
    vi.mocked(useMutation).mockReturnValue(
      {} as unknown as ReturnType<typeof useMutation>
    )

    useOrderPayment(useOrderPaymentMock.tenantId)

    const options = vi.mocked(useMutation).mock.calls[0]?.[0] as {
      onSuccess: () => void
      mutationFn: (orderId: string) => Promise<unknown>
    }
    vi.mocked(OrderService.markOrderPaid).mockResolvedValue({
      id: useOrderPaymentMock.orderId,
    } as unknown as Awaited<ReturnType<typeof OrderService.markOrderPaid>>)
    await expect(
      options.mutationFn(useOrderPaymentMock.orderId)
    ).resolves.toEqual({ id: useOrderPaymentMock.orderId })
    options.onSuccess()

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['orders', useOrderPaymentMock.tenantId],
    })
  })

  it('invalidates the empty tenant scope when the session has no store', () => {
    const invalidateQueries = vi.fn()
    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries,
    } as unknown as ReturnType<typeof useQueryClient>)
    vi.mocked(useMutation).mockReturnValue(
      {} as unknown as ReturnType<typeof useMutation>
    )

    useOrderPayment(null)

    const options = vi.mocked(useMutation).mock.calls.at(-1)?.[0] as {
      onSuccess: () => void
    }
    options.onSuccess()

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['orders', ''] })
  })
})
