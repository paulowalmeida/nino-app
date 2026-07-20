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
 * matching service (`@services/...`).
 */
export const queryKeys = {
  session: {
    all: ['session'] as const,
    me: () => [...queryKeys.session.all, 'me'] as const,
  },
  products: {
    all: (tenantId: string) => ['products', tenantId] as const,
    list: (tenantId: string, categoryId?: string) =>
      [...queryKeys.products.all(tenantId), 'list', categoryId ?? null] as const,
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
    list: (tenantId: string, status?: string) =>
      [...queryKeys.orders.all(tenantId), 'list', status ?? null] as const,
    detail: (tenantId: string, orderId: string) =>
      [...queryKeys.orders.all(tenantId), 'detail', orderId] as const,
  },
  tenant: {
    all: (tenantId: string) => ['tenant', tenantId] as const,
    settings: (tenantId: string) =>
      [...queryKeys.tenant.all(tenantId), 'settings'] as const,
  },
  customers: {
    all: (tenantId: string) => ['customers', tenantId] as const,
    list: (tenantId: string) =>
      [...queryKeys.customers.all(tenantId), 'list'] as const,
    detail: (tenantId: string, customerId: string) =>
      [...queryKeys.customers.all(tenantId), 'detail', customerId] as const,
  },
  team: {
    all: (tenantId: string) => ['team', tenantId] as const,
    list: (tenantId: string) =>
      [...queryKeys.team.all(tenantId), 'list'] as const,
  },
} as const
