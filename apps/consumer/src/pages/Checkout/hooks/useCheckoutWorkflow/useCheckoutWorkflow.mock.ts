export const useCheckoutWorkflowMock = {
  slug: 'loja-do-ze',
  cartItemName: 'Hambúrguer da casa',
  cartItemPrice: '18.00',
}

export const freeDeliveryOfferMock = {
  id: 'promotion-1',
  name: 'Frete grátis acima de R$ 60,00',
  type: 'FREE_DELIVERY' as const,
  value: 0,
  code: null,
  minOrderValue: 60,
  endsAt: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
}

export const promotionEndedErrorBodyMock = {
  statusCode: 409,
  code: 'PROMOTION_UNAVAILABLE',
  message: 'A promoção acabou. Confira o novo valor antes de confirmar.',
  deliveryFee: 7,
}
