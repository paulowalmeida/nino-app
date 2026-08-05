import type { CreateOrderRequest } from '@custom_types/order/create-order-request'
import type { Order } from '@custom_types/order/order'
import type { OrderPage } from '@custom_types/order/order-page'
import type { OrderQueueSummary } from '@custom_types/order/order-queue-summary'
import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type { SalesReport } from '@custom_types/order/sales-report'
import type { SalesSeries } from '@custom_types/order/sales-series'
import type { SeriesGranularity } from '@custom_types/order/series-granularity'
import type { TimingReport } from '@custom_types/order/timing-report'
import type { UpdateOrderStatusRequest } from '@custom_types/order/update-order-status-request'
import { api } from '@services/http.service'

type OrderListParams = {
  target: string
  direction: string
  size: number
  page: number
  search?: string
}

export const ORDER_PAGE_SIZE = 40

const isCustomRange = (
  params: ReportRangeParams
): params is Extract<ReportRangeParams, { from: string }> =>
  params.from !== undefined

const rangeQuery = (
  params: ReportRangeParams,
  granularity?: SeriesGranularity
): Record<string, string> => ({
  ...(isCustomRange(params)
    ? { from: params.from, to: params.to }
    : { period: params.period }),
  ...(granularity ? { granularity } : {}),
})

export const OrderService = {
  getQueueSummary: (tenantId: string): Promise<OrderQueueSummary> =>
    api.get<OrderQueueSummary>(`tenants/${tenantId}/orders/summary`),

  getSalesReport: (
    tenantId: string,
    params: ReportRangeParams
  ): Promise<SalesReport> =>
    api.getAll<Record<string, string>, SalesReport>(
      `tenants/${tenantId}/orders/report`,
      rangeQuery(params)
    ),

  getSalesSeries: (
    tenantId: string,
    params: ReportRangeParams,
    granularity?: SeriesGranularity
  ): Promise<SalesSeries> =>
    api.getAll<Record<string, string>, SalesSeries>(
      `tenants/${tenantId}/orders/report/series`,
      rangeQuery(params, granularity)
    ),

  getTimingReport: (
    tenantId: string,
    params: ReportRangeParams
  ): Promise<TimingReport> =>
    api.getAll<Record<string, string>, TimingReport>(
      `tenants/${tenantId}/orders/report/timing`,
      rangeQuery(params)
    ),

  listOrders: (
    tenantId: string,
    page: number,
    search?: string
  ): Promise<OrderPage> =>
    api.getAll<OrderListParams, OrderPage>(`tenants/${tenantId}/orders`, {
      target: 'createdAt',
      direction: 'desc',
      size: ORDER_PAGE_SIZE,
      page,
      ...(search ? { search } : {}),
    }),

  createOrder: (tenantId: string, data: CreateOrderRequest): Promise<Order> =>
    api.create<CreateOrderRequest, Order>(`tenants/${tenantId}/orders`, data),

  getById: (tenantId: string, orderId: string): Promise<Order> =>
    api.get<Order>(`tenants/${tenantId}/orders/${orderId}`),

  updateOrderStatus: (
    tenantId: string,
    orderId: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> =>
    api.patch<UpdateOrderStatusRequest, Order>(
      `tenants/${tenantId}/orders`,
      `${orderId}/status`,
      data
    ),

  markOrderPaid: (tenantId: string, orderId: string): Promise<Order> =>
    api.patch<{ paymentStatus: string }, Order>(
      `tenants/${tenantId}/orders`,
      `${orderId}/payment`,
      { paymentStatus: 'PAID' }
    ),
}
