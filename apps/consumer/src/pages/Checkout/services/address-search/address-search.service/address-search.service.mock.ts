import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'

export const checkoutAddressSearchResultsMock = [
  {
    id: 'place-1',
    providerId: 'place-1',
    precision: 'street',
    zipCode: '66000-000',
    street: 'Rua das Flores',
    neighborhood: 'Centro',
    city: 'Belém',
    state: 'PA',
    latitude: -1.45,
    longitude: -48.5,
  },
] satisfies AddressSearchResult[]
