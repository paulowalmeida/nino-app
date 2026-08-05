import type { CreateGuestOrderRequest } from '@custom_types/order/create-guest-order-request'
import type { GuestOrderCreatedResponse } from '@custom_types/order/guest-order-created-response'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import type { MyOrder } from '@custom_types/order/my-order'
import { api } from '@services/http.service'

/** Pedido sem conta — o único jeito de comprar até o login do cliente existir. */
export const createGuestOrder = (
  data: CreateGuestOrderRequest
): Promise<GuestOrderCreatedResponse> =>
  api.create<CreateGuestOrderRequest, GuestOrderCreatedResponse>(
    'orders/guest',
    data
  )

/** O token prova que quem pergunta é quem pediu — sem ele, 404. */
export const getGuestOrderStatus = (
  orderId: string,
  token: string
): Promise<GuestOrderStatus> =>
  api.getAll<GuestOrderStatus>(`orders/guest/${orderId}/status`, { token })

/**
 * Histórico do cliente logado. A API pagina; a primeira página cobre o que
 * cabe numa tela de histórico de delivery — quem precisa de mais que isso
 * está procurando um pedido específico, e para isso existe o link direto.
 */
export const listMyOrders = async (): Promise<MyOrder[]> => {
  const page = await api.get<{ data: MyOrder[] }>('my/orders')
  return page.data
}

/**
 * O mesmo status, pela porta de quem tem conta. O pedido do cliente logado não
 * precisa do token de acompanhamento: a sessão já prova quem ele é, e exigir o
 * link do WhatsApp para ver o próprio pedido seria pedir a chave de casa a
 * quem já está dentro.
 */
export const getMyOrderStatus = async (
  orderId: string
): Promise<GuestOrderStatus> => {
  const order = await api.get<{
    id: string
    status: GuestOrderStatus['status']
    channel: GuestOrderStatus['channel']
    estimatedDeliveryAt: string | null
    createdAt: string
    statusHistory: { status: GuestOrderStatus['status']; createdAt: string }[]
  }>(`my/orders/${orderId}`)

  return {
    id: order.id,
    status: order.status,
    channel: order.channel,
    estimatedDeliveryAt: order.estimatedDeliveryAt,
    createdAt: order.createdAt,
    timeline: order.statusHistory.map(({ status, createdAt }) => ({
      status,
      at: createdAt,
    })),
  }
}
