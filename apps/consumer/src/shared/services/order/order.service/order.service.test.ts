import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'
import { orderService } from './order.service'
import { orderServiceMock } from './order.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    create: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
  },
}))

describe('orderService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('exposes guest and authenticated order actions', () => {
    expect(orderService.createGuest).toBeTypeOf('function')
    expect(orderService.getGuestStatus).toBeTypeOf('function')
    expect(orderService.getMyStatus).toBeTypeOf('function')
    expect(orderService.listMine).toBeTypeOf('function')
  })

  it('sends the guest tracking token in the API header', async () => {
    vi.mocked(api.get).mockResolvedValue({} as never)

    await orderService.getGuestStatus(
      orderServiceMock.orderId,
      orderServiceMock.trackingToken
    )

    expect(api.get).toHaveBeenCalledWith(
      `orders/guest/${orderServiceMock.orderId}/status`,
      { headers: { 'x-guest-order-token': orderServiceMock.trackingToken } }
    )
  })
})
