import { api } from '@shared/services/http/http.service'
import type { AssignKitchenAssigneeRequest } from '@shared/types/order/assign-kitchen-assignee-request'
import type { CreateOrderRequest } from '@shared/types/order/create-order-request'
import type { Order } from '@shared/types/order/order'
import type { OrderAvailability } from '@shared/types/order/order-availability'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { OrderPage } from '@shared/types/order/order-page'
import type { OrderQueueSummary } from '@shared/types/order/order-queue-summary'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { PaymentStatus } from '@shared/types/order/payment-status'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type { SalesReport } from '@shared/types/order/sales-report'
import type { SalesSeries } from '@shared/types/order/sales-series'
import type { SalesSeriesBreakdown } from '@shared/types/order/sales-series-breakdown'
import type { SeriesGranularity } from '@shared/types/order/series-granularity'
import type { TimingReport } from '@shared/types/order/timing-report'
import type { UpdateOrderStatusRequest } from '@shared/types/order/update-order-status-request'

export const ORDER_PAGE_SIZE = 40

type DeliveryQuote = { id: string; name: string; fee: number }
type DeliveryQuoteResponse = Omit<DeliveryQuote, 'fee'> & {
  fee: number | string
}
type DeliveryCoordinates = {
  latitude?: number
  longitude?: number
}

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
  getAvailability: (unitId: string): Promise<OrderAvailability> =>
    api.get<OrderAvailability>(`units/${unitId}/orders/availability`),

  getDeliveryQuote: (
    unitId: string,
    zipCode: string,
    coordinates: DeliveryCoordinates = {}
  ): Promise<DeliveryQuote | null> =>
    api
      .get<DeliveryQuoteResponse | null>(
        (() => {
          const params = new URLSearchParams({ unitId })
          if (zipCode) params.set('zipCode', zipCode)
          if (
            coordinates.latitude !== undefined &&
            coordinates.longitude !== undefined
          ) {
            params.set('latitude', String(coordinates.latitude))
            params.set('longitude', String(coordinates.longitude))
          }
          return `orders/guest/quote?${params.toString()}`
        })()
      )
      .then((quote) =>
        quote
          ? { id: quote.id, name: quote.name, fee: Number(quote.fee) }
          : null
      ),

  getQueueSummary: (unitId: string): Promise<OrderQueueSummary> =>
    api.get<OrderQueueSummary>(`units/${unitId}/orders/summary`),

  getSalesReport: (
    unitId: string,
    params: ReportRangeParams
  ): Promise<SalesReport> =>
    api.getAll<SalesReport>(
      `units/${unitId}/orders/report`,
      rangeQuery(params)
    ),

  getSalesSeries: (
    unitId: string,
    params: ReportRangeParams,
    granularity?: SeriesGranularity
  ): Promise<SalesSeries> =>
    api.getAll<SalesSeries>(
      `units/${unitId}/orders/report/series`,
      rangeQuery(params, granularity)
    ),

  getSalesSeriesByChannel: (
    unitId: string,
    params: ReportRangeParams,
    granularity?: SeriesGranularity
  ): Promise<SalesSeriesBreakdown> =>
    api.getAll<SalesSeriesBreakdown>(
      `units/${unitId}/orders/report/series/by-channel`,
      rangeQuery(params, granularity)
    ),

  getSalesSeriesByPaymentMethod: (
    unitId: string,
    params: ReportRangeParams,
    granularity?: SeriesGranularity
  ): Promise<SalesSeriesBreakdown> =>
    api.getAll<SalesSeriesBreakdown>(
      `units/${unitId}/orders/report/series/by-payment-method`,
      rangeQuery(params, granularity)
    ),

  getTimingReport: (
    unitId: string,
    params: ReportRangeParams
  ): Promise<TimingReport> =>
    api.getAll<TimingReport>(
      `units/${unitId}/orders/report/timing`,
      rangeQuery(params)
    ),

  listOrders: (
    unitId: string,
    page: number,
    search?: string,
    statuses?: OrderStatusKey[],
    channel?: OrderChannel | OrderChannel[],
    paymentStatus?: PaymentStatus,
    requiresPreparation?: boolean
  ): Promise<OrderPage> =>
    api.getAll<OrderPage>(`units/${unitId}/orders`, {
      target: 'createdAt',
      direction: 'desc',
      size: ORDER_PAGE_SIZE,
      page,
      ...(search ? { search } : {}),
      ...(statuses?.length ? { status: statuses.join(',') } : {}),
      ...(channel
        ? { channel: Array.isArray(channel) ? channel.join(',') : channel }
        : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(requiresPreparation ? { requiresPreparation: 'true' } : {}),
    }),

  createOrder: (unitId: string, data: CreateOrderRequest): Promise<Order> =>
    api.create<CreateOrderRequest, Order>(`units/${unitId}/orders`, data, {
      headers: { 'Idempotency-Key': crypto.randomUUID() },
    }),

  getById: (unitId: string, orderId: string): Promise<Order> =>
    api.get<Order>(`units/${unitId}/orders/${orderId}`),

  updateOrderStatus: (
    unitId: string,
    orderId: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> =>
    api.patch<UpdateOrderStatusRequest, Order>(
      `units/${unitId}/orders/${orderId}/status`,
      data
    ),

  assignKitchenAssignee: (
    unitId: string,
    orderId: string,
    data: AssignKitchenAssigneeRequest
  ): Promise<Order> =>
    api.patch<AssignKitchenAssigneeRequest, Order>(
      `units/${unitId}/orders/${orderId}/kitchen-assignee`,
      data
    ),

  clearKitchenAssignee: (unitId: string, orderId: string): Promise<Order> =>
    api.remove<Order>(`units/${unitId}/orders/${orderId}/kitchen-assignee`),

  markOrderPaid: (unitId: string, orderId: string): Promise<Order> =>
    api.patch<{ paymentStatus: string }, Order>(
      `units/${unitId}/orders/${orderId}/payment`,
      { paymentStatus: 'PAID' }
    ),

  cancelOrderItem: (
    unitId: string,
    orderId: string,
    itemId: string,
    cancelReason: string
  ): Promise<Order> =>
    api.patch<{ cancelReason: string }, Order>(
      `units/${unitId}/orders/${orderId}/items/${itemId}/cancel`,
      { cancelReason }
    ),
}
