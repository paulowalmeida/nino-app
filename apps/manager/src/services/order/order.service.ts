import type {
  CreateOrderRequest,
  Order,
  OrderPage,
  OrderQueueSummary,
  ReportRangeParams,
  SalesReport,
  SalesSeries,
  SeriesGranularity,
  TimingReport,
  UpdateOrderStatusRequest,
} from '@custom_types/order'
import { ApiFactory } from '@services/api/api.service'

const { get, getAll, create, patch } = ApiFactory()

type OrderListParams = {
  target: string
  direction: string
  size: number
  page: number
  search?: string
}

/** The API caps `size` at 100. */
export const ORDER_PAGE_SIZE = 40

export const getQueueSummary = (tenantId: string): Promise<OrderQueueSummary> =>
  get<OrderQueueSummary>(`tenants/${tenantId}/orders/summary`)

/**
 * Monta a query do recorte. Só entra o que existe: `searchParams` com valor
 * `undefined` viraria a string "undefined" na URL.
 */
const rangeQuery = (
  params: ReportRangeParams,
  granularity?: SeriesGranularity
): Record<string, string> => ({
  ...(params.period
    ? { period: params.period }
    : { from: params.from, to: params.to }),
  ...(granularity ? { granularity } : {}),
})

export const getSalesReport = (
  tenantId: string,
  params: ReportRangeParams
): Promise<SalesReport> =>
  getAll<Record<string, string>, SalesReport>(
    `tenants/${tenantId}/orders/report`,
    rangeQuery(params)
  )

/**
 * Série de venda no tempo. `granularity` é opcional: a API deriva do tamanho
 * do intervalo — "hoje" por dia seria um ponto só.
 */
export const getSalesSeries = (
  tenantId: string,
  params: ReportRangeParams,
  granularity?: SeriesGranularity
): Promise<SalesSeries> =>
  getAll<Record<string, string>, SalesSeries>(
    `tenants/${tenantId}/orders/report/series`,
    rangeQuery(params, granularity)
  )

export const getTimingReport = (
  tenantId: string,
  params: ReportRangeParams
): Promise<TimingReport> =>
  getAll<Record<string, string>, TimingReport>(
    `tenants/${tenantId}/orders/report/timing`,
    rangeQuery(params)
  )

/**
 * Newest first — the order the store has to act on. No status filter: the
 * live queue and the recent history come from the same read, and the panel
 * splits them by stage without paying for another request.
 */
/**
 * `search` casa com código do pedido, nome ou telefone — e é resolvido no
 * servidor de propósito: filtrar no cliente só acharia o que já foi paginado,
 * e quem procura um pedido específico costuma procurar um antigo.
 */
export const listOrders = (
  tenantId: string,
  page: number,
  search?: string
): Promise<OrderPage> =>
  getAll<OrderListParams, OrderPage>(`tenants/${tenantId}/orders`, {
    target: 'createdAt',
    direction: 'desc',
    size: ORDER_PAGE_SIZE,
    page,
    ...(search ? { search } : {}),
  })

export const createOrder = (
  tenantId: string,
  data: CreateOrderRequest
): Promise<Order> =>
  create<CreateOrderRequest, Order>(`tenants/${tenantId}/orders`, data)

export const getById = (tenantId: string, orderId: string): Promise<Order> =>
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
