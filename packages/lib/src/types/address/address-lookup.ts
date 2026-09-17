/** O que um CEP responde: o endereço menos o número e o complemento. */
export type AddressLookup = {
  street: string
  neighborhood: string
  city: string
  state: string
}

export type AddressSearchPrecision =
  | 'point'
  | 'street'
  | 'neighborhood'
  | 'postal_code'
  | 'city'
  | 'state'
  | 'country'
  | 'unknown'

export type AddressSearchResult = AddressLookup & {
  id: string
  providerId: string
  precision: AddressSearchPrecision
  zipCode: string
  latitude: number
  longitude: number
}
