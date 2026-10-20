import type { ReportRangeParams } from '@shared/types/order/report-range-params'

const rangeKey = (range: ReportRangeParams) =>
  'period' in range
    ? (['period', range.period] as const)
    : (['range', range.from, range.to] as const)

export const queryKeys = {
  session: {
    all: ['session'] as const,
    me: () => [...queryKeys.session.all, 'me'] as const,
  },
  products: {
    all: (unitId: string) => ['products', unitId] as const,
    list: (unitId: string, categoryId?: string) =>
      [...queryKeys.products.all(unitId), 'list', categoryId ?? null] as const,
    catalog: (unitId: string, categoryId: string | null, search: string) =>
      [
        ...queryKeys.products.all(unitId),
        'catalog',
        categoryId,
        search,
      ] as const,
    detail: (unitId: string, productId: string) =>
      [...queryKeys.products.all(unitId), 'detail', productId] as const,
  },
  productCategories: {
    all: (unitId: string) => ['product-categories', unitId] as const,
    list: (unitId: string) =>
      [...queryKeys.productCategories.all(unitId), 'list'] as const,
  },
  orders: {
    all: (unitId: string) => ['orders', unitId] as const,
    list: (
      unitId: string,
      status?: string,
      search?: string,
      channel?: string,
      paymentStatus?: string,
      requiresPreparation?: boolean
    ) =>
      [
        ...queryKeys.orders.all(unitId),
        'list',
        status ?? null,
        search ?? null,
        channel ?? null,
        paymentStatus ?? null,
        requiresPreparation ?? null,
      ] as const,
    detail: (unitId: string, orderId: string) =>
      [...queryKeys.orders.all(unitId), 'detail', orderId] as const,
    report: (unitId: string, range: ReportRangeParams) =>
      [...queryKeys.orders.all(unitId), 'report', ...rangeKey(range)] as const,
    series: (unitId: string, range: ReportRangeParams, granularity?: string) =>
      [
        ...queryKeys.orders.all(unitId),
        'series',
        ...rangeKey(range),
        granularity ?? null,
      ] as const,
    seriesByChannel: (
      unitId: string,
      range: ReportRangeParams,
      granularity?: string
    ) =>
      [
        ...queryKeys.orders.all(unitId),
        'series-by-channel',
        ...rangeKey(range),
        granularity ?? null,
      ] as const,
    seriesByPaymentMethod: (
      unitId: string,
      range: ReportRangeParams,
      granularity?: string
    ) =>
      [
        ...queryKeys.orders.all(unitId),
        'series-by-payment-method',
        ...rangeKey(range),
        granularity ?? null,
      ] as const,
    timingReport: (unitId: string, range: ReportRangeParams) =>
      [
        ...queryKeys.orders.all(unitId),
        'timing-report',
        ...rangeKey(range),
      ] as const,
  },
  tabs: {
    all: (unitId: string) => ['tabs', unitId] as const,
    lists: (unitId: string) => [...queryKeys.tabs.all(unitId), 'list'] as const,
    list: (unitId: string, statuses: readonly string[]) =>
      [...queryKeys.tabs.lists(unitId), statuses.join(',')] as const,
    detail: (unitId: string, tabId: string) =>
      [...queryKeys.tabs.all(unitId), 'detail', tabId] as const,
  },
  unit: {
    all: (unitId: string) => ['unit', unitId] as const,
    settings: (unitId: string) =>
      [...queryKeys.unit.all(unitId), 'settings'] as const,
    publicSettings: (unitId: string) =>
      [...queryKeys.unit.all(unitId), 'settings', 'public'] as const,
    diningTables: (unitId: string) =>
      [...queryKeys.unit.all(unitId), 'dining-tables'] as const,
    theme: (unitId: string) =>
      [...queryKeys.unit.all(unitId), 'theme'] as const,
  },
  promotions: {
    all: (unitId: string) => ['promotions', unitId] as const,
    list: (unitId: string) =>
      [...queryKeys.promotions.all(unitId), 'list'] as const,
  },
  consumers: {
    all: (unitId: string) => ['consumers', unitId] as const,
    list: (unitId: string, search?: string) =>
      [...queryKeys.consumers.all(unitId), 'list', search ?? null] as const,
    detail: (unitId: string, consumerId: string) =>
      [...queryKeys.consumers.all(unitId), 'detail', consumerId] as const,
    top: (unitId: string, metric: string) =>
      [...queryKeys.consumers.all(unitId), 'top', metric] as const,
  },
  team: {
    all: (unitId: string) => ['team', unitId] as const,
    list: (unitId: string, status: 'active' | 'inactive' = 'active') =>
      [...queryKeys.team.all(unitId), 'list', status] as const,
  },
  positions: {
    all: (unitId: string) => ['positions', unitId] as const,
    list: (unitId: string) =>
      [...queryKeys.positions.all(unitId), 'list'] as const,
    permissions: (unitId: string) =>
      [...queryKeys.positions.all(unitId), 'permissions'] as const,
  },
  cash: {
    all: (unitId: string) => ['cash', unitId] as const,
    current: (unitId: string) =>
      [...queryKeys.cash.all(unitId), 'current'] as const,
    byDate: (unitId: string, date: string) =>
      [...queryKeys.cash.all(unitId), 'by-date', date] as const,
  },
  account: {
    all: () => ['account'] as const,
    subscription: () => [...queryKeys.account.all(), 'subscription'] as const,
    plans: () => [...queryKeys.account.all(), 'plans'] as const,
  },
} as const
