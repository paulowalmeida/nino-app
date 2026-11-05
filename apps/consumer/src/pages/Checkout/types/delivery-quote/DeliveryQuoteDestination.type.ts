import type { Address } from '@custom_types/address/address'

/* WHY: o visitante cota pelo ponto escolhido no Google; o logado, pelo
 * endereço salvo, que a API geocodifica no Google. */
export type DeliveryQuoteDestination =
  | { latitude: number; longitude: number }
  | Pick<
      Address,
      'id' | 'zipCode' | 'street' | 'number' | 'neighborhood' | 'city' | 'state'
    >
