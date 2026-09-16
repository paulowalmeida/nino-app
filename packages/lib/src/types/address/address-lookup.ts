/** O que um CEP responde: o endereço menos o número e o complemento. */
export type AddressLookup = {
  street: string
  neighborhood: string
  city: string
  state: string
}

export type AddressSearchResult = AddressLookup & {
  id: string
  zipCode: string
  latitude: number
  longitude: number
}
