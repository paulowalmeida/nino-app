/**
 * Chaves de cache do consumidor. Tudo é escopado pela loja: `store` pelo
 * slug (é o que a URL carrega), `menu` pelo unitId resolvido.
 */
export const queryKeys = {
  store: {
    all: ['store'] as const,
    bySlug: (slug: string) => [...queryKeys.store.all, slug] as const,
  },
  menu: {
    all: ['menu'] as const,
    byUnit: (unitId: string) => [...queryKeys.menu.all, unitId] as const,
  },
  settings: {
    all: ['settings'] as const,
    byUnit: (unitId: string) =>
      [...queryKeys.settings.all, unitId] as const,
  },
  deliveryZones: {
    all: ['delivery-zones'] as const,
    byUnit: (unitId: string) =>
      [...queryKeys.deliveryZones.all, unitId] as const,
  },
  deliveryQuote: {
    all: ['delivery-quote'] as const,
    byUnitAndZip: (unitId: string, zipCode: string) =>
      [...queryKeys.deliveryQuote.all, unitId, zipCode] as const,
  },
  promotions: {
    all: ['promotions'] as const,
    visibleByUnit: (unitId: string) =>
      [...queryKeys.promotions.all, unitId, 'visible'] as const,
  },
  openingHours: {
    all: ['opening-hours'] as const,
    byUnit: (unitId: string) =>
      [...queryKeys.openingHours.all, unitId] as const,
  },
  guestOrder: {
    all: ['guest-order'] as const,
    byId: (orderId: string) => [...queryKeys.guestOrder.all, orderId] as const,
  },
  session: {
    all: ['session'] as const,
  },
  myOrders: {
    all: ['my-orders'] as const,
  },
  myAddresses: {
    all: ['my-addresses'] as const,
  },
  myNotifications: {
    all: ['my-notifications'] as const,
  },
}
