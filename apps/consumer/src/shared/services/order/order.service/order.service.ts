import type { CreateGuestOrderRequest } from '@custom_types/order/create-guest-order-request'
import type { CreateConsumerOrderRequest } from '@custom_types/order/create-consumer-order-request'
import type { GuestOrderCreatedResponse } from '@custom_types/order/guest-order-created-response'
import type { OrderCreatedResponse } from '@custom_types/order/order-created-response'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import type { MyOrder } from '@custom_types/order/my-order'
import { myOrderStatus } from '@shared/adapters/myOrderStatus/myOrderStatus.adapter'
import { api } from '@shared/services/http/http.service'

/** Pedido sem conta — o único jeito de comprar até o login do cliente existir. */
export const orderService = {
  createMine: (
    data: CreateConsumerOrderRequest,
    idempotencyKey: string
  ): Promise<OrderCreatedResponse> =>
    api.create<CreateConsumerOrderRequest, OrderCreatedResponse>(
      'my/orders',
      data,
      { headers: { 'Idempotency-Key': idempotencyKey } }
    ),
  createGuest: (
    data: CreateGuestOrderRequest,
    idempotencyKey: string
  ): Promise<GuestOrderCreatedResponse> =>
    api.create<CreateGuestOrderRequest, GuestOrderCreatedResponse>(
      'orders/guest',
      data,
      { headers: { 'Idempotency-Key': idempotencyKey } }
    ),
  getGuestStatus: (orderId: string, token: string): Promise<GuestOrderStatus> =>
    api.get<GuestOrderStatus>(`orders/guest/${orderId}/status`, {
      headers: { 'x-guest-order-token': token },
    }),
  listMine: async (): Promise<MyOrder[]> => {
    const page = await api.get<{ data: MyOrder[] }>('my/orders')
    return page.data
  },
  getMyStatus: async (orderId: string): Promise<GuestOrderStatus> => {
    const order = await api.get<Parameters<typeof myOrderStatus>[0]>(
      `my/orders/${orderId}`
    )
    return myOrderStatus(order)
  },
}
