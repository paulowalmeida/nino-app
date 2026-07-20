/**
 * Chaves de cache do consumidor. Tudo é escopado pela loja: `store` pelo
 * slug (é o que a URL carrega), `menu` pelo tenantId resolvido.
 */
export const queryKeys = {
  store: {
    all: ['store'] as const,
    bySlug: (slug: string) => [...queryKeys.store.all, slug] as const,
  },
  menu: {
    all: ['menu'] as const,
    byTenant: (tenantId: string) => [...queryKeys.menu.all, tenantId] as const,
  },
}
