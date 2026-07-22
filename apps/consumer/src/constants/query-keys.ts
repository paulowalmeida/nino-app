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
  settings: {
    all: ['settings'] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.settings.all, tenantId] as const,
  },
  deliveryZones: {
    all: ['delivery-zones'] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.deliveryZones.all, tenantId] as const,
  },
  openingHours: {
    all: ['opening-hours'] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.openingHours.all, tenantId] as const,
  },
  guestOrder: {
    all: ['guest-order'] as const,
    byId: (orderId: string) => [...queryKeys.guestOrder.all, orderId] as const,
  },
}
