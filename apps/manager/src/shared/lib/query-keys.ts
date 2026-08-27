/**
 * TanStack Query key convention for the manager.
 *
 * Rules:
 * - Every store-scoped key starts with the domain name and is scoped by
 *   `tenantId` (second segment), since everything in the panel is per store.
 * - `all` is the domain root for a tenant — use it in `invalidateQueries` to
 *   wipe the whole domain at once.
 * - `list` and `detail` derive from `all` so they inherit that invalidation.
 *
 * Domain hooks live in `src/hooks/<domain>/`, consume these keys and the
 * matching service (`@shared/services/...`).
 */
import type { ReportRangeParams } from 'src/shared/types/order/report-range-params'
/** Um recorte vira uma string estável: preset ou o par de dias. */
const rangeKey = (range: ReportRangeParams): string =>
  range.period ?? `${range.from}:${range.to}`

export const queryKeys = {
  session: {
    all: ['session'] as const,
    me: () => [...queryKeys.session.all, 'me'] as const,
  },
  products: {
    all: (tenantId: string) => ['products', tenantId] as const,
    list: (tenantId: string, categoryId?: string) =>
      [
        ...queryKeys.products.all(tenantId),
        'list',
        categoryId ?? null,
      ] as const,
    /** O recorte da tela de cardápio: categoria + busca fazem parte da chave,
     *  senão trocar de filtro reaproveita o cache do filtro anterior. */
    catalog: (tenantId: string, categoryId: string | null, search: string) =>
      [
        ...queryKeys.products.all(tenantId),
        'catalog',
        categoryId,
        search,
      ] as const,
    detail: (tenantId: string, productId: string) =>
      [...queryKeys.products.all(tenantId), 'detail', productId] as const,
  },
  productCategories: {
    all: (tenantId: string) => ['product-categories', tenantId] as const,
    list: (tenantId: string) =>
      [...queryKeys.productCategories.all(tenantId), 'list'] as const,
  },
  orders: {
    all: (tenantId: string) => ['orders', tenantId] as const,
    list: (tenantId: string, status?: string, search?: string) =>
      [
        ...queryKeys.orders.all(tenantId),
        'list',
        status ?? null,
        search ?? null,
      ] as const,
    detail: (tenantId: string, orderId: string) =>
      [...queryKeys.orders.all(tenantId), 'detail', orderId] as const,
    report: (tenantId: string, range: ReportRangeParams) =>
      [...queryKeys.orders.all(tenantId), 'report', rangeKey(range)] as const,
    series: (
      tenantId: string,
      range: ReportRangeParams,
      granularity?: string
    ) =>
      [
        ...queryKeys.orders.all(tenantId),
        'series',
        rangeKey(range),
        granularity ?? null,
      ] as const,
    seriesByChannel: (
      tenantId: string,
      range: ReportRangeParams,
      granularity?: string
    ) =>
      [
        ...queryKeys.orders.all(tenantId),
        'series-by-channel',
        rangeKey(range),
        granularity ?? null,
      ] as const,
    seriesByPaymentMethod: (
      tenantId: string,
      range: ReportRangeParams,
      granularity?: string
    ) =>
      [
        ...queryKeys.orders.all(tenantId),
        'series-by-payment-method',
        rangeKey(range),
        granularity ?? null,
      ] as const,
    timingReport: (tenantId: string, range: ReportRangeParams) =>
      [
        ...queryKeys.orders.all(tenantId),
        'timing-report',
        rangeKey(range),
      ] as const,
  },
  tenant: {
    all: (tenantId: string) => ['tenant', tenantId] as const,
    settings: (tenantId: string) =>
      [...queryKeys.tenant.all(tenantId), 'settings'] as const,
  },
  customers: {
    all: (tenantId: string) => ['customers', tenantId] as const,
    list: (tenantId: string, search?: string) =>
      [
        ...queryKeys.customers.all(tenantId),
        'list',
        search ?? null,
      ] as const,
    detail: (tenantId: string, customerId: string) =>
      [...queryKeys.customers.all(tenantId), 'detail', customerId] as const,
    top: (tenantId: string, metric: string) =>
      [...queryKeys.customers.all(tenantId), 'top', metric] as const,
  },
  team: {
    all: (tenantId: string) => ['team', tenantId] as const,
    list: (tenantId: string) =>
      [...queryKeys.team.all(tenantId), 'list'] as const,
  },
  account: {
    all: () => ['account'] as const,
    subscription: () => [...queryKeys.account.all(), 'subscription'] as const,
  },
} as const
