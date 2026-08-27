import { useQuery } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useOrder } from './useOrder'
import { useOrderMock } from './useOrder.mock'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: vi.fn(),
}))
vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { getById: vi.fn() },
}))

describe('useOrder', () => {
  it('configures a tenant-scoped detail query', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useQuery>)

    useOrder(useOrderMock.tenantId, useOrderMock.orderId)

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [
          'orders',
          useOrderMock.tenantId,
          'detail',
          useOrderMock.orderId,
        ],
        enabled: true,
        refetchInterval: 25_000,
      })
    )
    vi.mocked(OrderService.getById).mockResolvedValue({
      id: useOrderMock.orderId,
    } as never)
    await expect(
      (
        vi.mocked(useQuery).mock.calls[0]?.[0] as unknown as {
          queryFn: () => Promise<unknown>
        }
      ).queryFn()
    ).resolves.toEqual({ id: useOrderMock.orderId })
  })

  it('disables the query without a tenant', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useQuery>)

    useOrder(null, useOrderMock.orderId)

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    )
  })
})
