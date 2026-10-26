export const checkoutTotalsMock = {
  cartLines: [
    {
      id: 'product-1||',
      item: {
        id: 'product-1',
        name: 'Produto',
        imageUrl: null,
        price: '12.5',
        modifiers: [],
      },
      quantity: 2,
    },
  ],
  deliveryFee: '5',
  estimatedMinutes: 30,
  campaignZone: {
    id: 'zone-centro',
    name: 'Centro',
    minRadiusKm: 0,
    maxRadiusKm: 5,
    fee: '5',
  },
  freeDelivery: {
    id: 'promotion-1',
    name: 'Frete grátis acima de R$ 20,00',
    type: 'FREE_DELIVERY' as const,
    value: 0,
    code: null,
    minOrderValue: 20,
    maxDiscount: null,
    endsAt: null,
    allDeliveryZones: false,
    deliveryZoneIds: ['zone-centro'],
    giftProduct: null,
  },
}
