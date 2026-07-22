import type { CreateGuestOrderRequest } from '@custom_types/order/create-guest-order-request'
import type { GuestOrderCreatedResponse } from '@custom_types/order/guest-order-created-response'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { getWith, post } from '@services/api/api.service'

/** Pedido sem conta — o único jeito de comprar até o login do cliente existir. */
export const createGuestOrder = (
  data: CreateGuestOrderRequest
): Promise<GuestOrderCreatedResponse> =>
  post<CreateGuestOrderRequest, GuestOrderCreatedResponse>('orders/guest', data)

/** O token prova que quem pergunta é quem pediu — sem ele, 404. */
export const getGuestOrderStatus = (
  orderId: string,
  token: string
): Promise<GuestOrderStatus> =>
  getWith<GuestOrderStatus>(`orders/guest/${orderId}/status`, { token })
