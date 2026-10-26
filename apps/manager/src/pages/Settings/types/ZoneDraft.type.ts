export type ZoneDraft = {
  maxRadiusKm: number
  fee: number
  freeDeliveryEnabled: boolean
  /** `null` = frete grátis em qualquer pedido. */
  freeDeliveryMinOrder: number | null
}
