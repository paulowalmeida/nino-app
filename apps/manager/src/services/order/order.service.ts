import type {
  CreateOrderRequest,
  Order,
  OrderPage,
  OrderQueueSummary,
  SalesReport,
  UpdateOrderStatusRequest,
} from '@custom_types/order'
import { ApiFactory } from '@services/api/api.service'

const { get, getAll, create, patch } = ApiFactory()

type OrderListParams = {
  target: string
  direction: string
  size: number
  page: number
}

/** The API caps `size` at 100. */
export const ORDER_PAGE_SIZE = 40

export const getQueueSummary = (tenantId: string): Promise<OrderQueueSummary> =>
  get<OrderQueueSummary>(`tenants/${tenantId}/orders/summary`)

export const getSalesReport = (
  tenantId: string,
  from: string,
  to: string
): Promise<SalesReport> =>
  getAll<{ from: string; to: string }, SalesReport>(
    `tenants/${tenantId}/orders/report`,
    { from, to }
  )

/**
 * Newest first — the order the store has to act on. No status filter: the
 * live queue and the recent history come from the same read, and the panel
 * splits them by stage without paying for another request.
 */
export const listOrders = (
  tenantId: string,
  page: number
): Promise<OrderPage> =>
  getAll<OrderListParams, OrderPage>(`tenants/${tenantId}/orders`, {
    target: 'createdAt',
    direction: 'desc',
    size: ORDER_PAGE_SIZE,
    page,
  })

export const createOrder = (
  tenantId: string,
  data: CreateOrderRequest
): Promise<Order> =>
  create<CreateOrderRequest, Order>(`tenants/${tenantId}/orders`, data)

export const getOrder = (tenantId: string, orderId: string): Promise<Order> =>
  get<Order>(`tenants/${tenantId}/orders/${orderId}`)

export const updateOrderStatus = (
  tenantId: string,
  orderId: string,
  data: UpdateOrderStatusRequest
): Promise<Order> =>
  patch<UpdateOrderStatusRequest, Order>(
    `tenants/${tenantId}/orders`,
    `${orderId}/status`,
    data
  )

export const markOrderPaid = (
  tenantId: string,
  orderId: string
): Promise<Order> =>
  patch<{ paymentStatus: string }, Order>(
    `tenants/${tenantId}/orders`,
    `${orderId}/payment`,
    { paymentStatus: 'PAID' }
  )
