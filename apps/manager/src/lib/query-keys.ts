/**
 * Convenção de query keys do TanStack Query no painel.
 *
 * Regras:
 * - Toda key começa pelo nome do domínio e é escopada por `tenantId`
 *   (segundo segmento), já que tudo no painel é por loja.
 * - `all` é a raiz do domínio para um tenant — use em
 *   `invalidateQueries` para limpar todo o domínio de uma vez.
 * - `list` e `detail` derivam de `all` para herdarem a invalidação.
 *
 * Hooks por domínio ficam em `src/hooks/<domínio>/` (ex.:
 * `useProducts`), consomem estas keys e o service correspondente
 * (`@services/...`). Os services chegam nas tarefas NMAG-157..160.
 */
export const queryKeys = {
  products: {
    all: (tenantId: string) => ["products", tenantId] as const,
    list: (tenantId: string, categoryId?: string) =>
      [...queryKeys.products.all(tenantId), "list", categoryId ?? null] as const,
    detail: (tenantId: string, productId: string) =>
      [...queryKeys.products.all(tenantId), "detail", productId] as const,
  },
  productCategories: {
    all: (tenantId: string) => ["product-categories", tenantId] as const,
    list: (tenantId: string) =>
      [...queryKeys.productCategories.all(tenantId), "list"] as const,
  },
  orders: {
    all: (tenantId: string) => ["orders", tenantId] as const,
    list: (tenantId: string, status?: string) =>
      [...queryKeys.orders.all(tenantId), "list", status ?? null] as const,
    detail: (tenantId: string, orderId: string) =>
      [...queryKeys.orders.all(tenantId), "detail", orderId] as const,
  },
  tenant: {
    all: (tenantId: string) => ["tenant", tenantId] as const,
    settings: (tenantId: string) =>
      [...queryKeys.tenant.all(tenantId), "settings"] as const,
  },
  team: {
    all: (tenantId: string) => ["team", tenantId] as const,
    list: (tenantId: string) =>
      [...queryKeys.team.all(tenantId), "list"] as const,
  },
} as const
