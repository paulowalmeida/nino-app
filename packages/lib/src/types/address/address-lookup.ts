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
  number: string
  latitude: number
  longitude: number
}

/** WHY: the provider's session-priced autocomplete step only returns text
 * and a place id, never zip/neighborhood/coordinates — those are resolved
 * separately, once, when the guest selects a prediction. */
export type AddressPrediction = {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}
