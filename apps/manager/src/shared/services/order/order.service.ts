import { api } from '@shared/services/http/http.service'
import type {
  CreateOrderRequest,
} from '@shared/types/order/create-order-request'
import type { Order } from '@shared/types/order/order'
import type { OrderAvailability } from '@shared/types/order/order-availability'
import type { OrderPage } from '@shared/types/order/order-page'
import type { OrderQueueSummary } from '@shared/types/order/order-queue-summary'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type { SalesReport } from '@shared/types/order/sales-report'
import type { SalesSeries } from '@shared/types/order/sales-series'
import type {
  SalesSeriesBreakdown,
} from '@shared/types/order/sales-series-breakdown'
import type { SeriesGranularity } from '@shared/types/order/series-granularity'
import type { TimingReport } from '@shared/types/order/timing-report'
import type { UpdateOrderStatusRequest } from '@shared/types/order/update-order-status-request'

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
  getAvailability: (tenantId: string): Promise<OrderAvailability> =>
    api.get<OrderAvailability>(`tenants/${tenantId}/orders/availability`),

  getQueueSummary: (tenantId: string): Promise<OrderQueueSummary> =>
    api.get<OrderQueueSummary>(`tenants/${tenantId}/orders/summary`),

  getSalesReport: (
    tenantId: string,
    params: ReportRangeParams
  ): Promise<SalesReport> =>
    api.getAll<SalesReport>(
      `tenants/${tenantId}/orders/report`,
      rangeQuery(params)
    ),

  getSalesSeries: (
    tenantId: string,
    params: ReportRangeParams,
    granularity?: SeriesGranularity
  ): Promise<SalesSeries> =>
    api.getAll<SalesSeries>(
      `tenants/${tenantId}/orders/report/series`,
      rangeQuery(params, granularity)
    ),

  getSalesSeriesByChannel: (
    tenantId: string,
    params: ReportRangeParams,
    granularity?: SeriesGranularity
  ): Promise<SalesSeriesBreakdown> =>
    api.getAll<SalesSeriesBreakdown>(
      `tenants/${tenantId}/orders/report/series/by-channel`,
      rangeQuery(params, granularity)
    ),

  getSalesSeriesByPaymentMethod: (
    tenantId: string,
    params: ReportRangeParams,
    granularity?: SeriesGranularity
  ): Promise<SalesSeriesBreakdown> =>
    api.getAll<SalesSeriesBreakdown>(
      `tenants/${tenantId}/orders/report/series/by-payment-method`,
      rangeQuery(params, granularity)
    ),

  getTimingReport: (
    tenantId: string,
    params: ReportRangeParams
  ): Promise<TimingReport> =>
    api.getAll<TimingReport>(
      `tenants/${tenantId}/orders/report/timing`,
      rangeQuery(params)
    ),

  listOrders: (
    tenantId: string,
    page: number,
    search?: string,
    statuses?: OrderStatusKey[]
  ): Promise<OrderPage> =>
    api.getAll<OrderPage>(`tenants/${tenantId}/orders`, {
      target: 'createdAt',
      direction: 'desc',
      size: ORDER_PAGE_SIZE,
      page,
      ...(search ? { search } : {}),
      ...(statuses?.length ? { status: statuses.join(',') } : {}),
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
      `tenants/${tenantId}/orders/${orderId}/status`,
      data
    ),

  markOrderPaid: (tenantId: string, orderId: string): Promise<Order> =>
    api.patch<{ paymentStatus: string }, Order>(
      `tenants/${tenantId}/orders/${orderId}/payment`,
      { paymentStatus: 'PAID' }
    ),
}
