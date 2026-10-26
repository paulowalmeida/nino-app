export type DeliveryZone = {
  id: string
  minRadiusKm: number
  maxRadiusKm: number
  fee: number
  isActive: boolean
  freeDeliveryEnabled: boolean
  /** `null` = frete grátis em qualquer pedido. */
  freeDeliveryMinOrder: number | null
}
