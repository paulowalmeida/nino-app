import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'

export const counterAddressSearchParamsMock = {
  state: 'PA',
  city: 'Ananindeua',
  street: 'WE-69-A',
}

export const counterAddressSearchResultsMock = [
  {
    id: 'address-1',
    providerId: 'address-1',
    precision: 'street',
    zipCode: '67143-450',
    street: 'Travessa WE-69-A',
    neighborhood: 'Coqueiro',
    city: 'Ananindeua',
    state: 'PA',
    latitude: -1.35,
    longitude: -48.37,
  },
] satisfies AddressSearchResult[]
