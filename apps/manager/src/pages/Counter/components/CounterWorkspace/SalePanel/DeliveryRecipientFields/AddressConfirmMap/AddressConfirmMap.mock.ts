import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'

export const confirmedAddressMock = {
  id: 'place-1',
  providerId: 'place-1',
  precision: 'point',
  zipCode: '67143-450',
  street: 'Travessa WE-69-A',
  number: '1562',
  neighborhood: 'Coqueiro',
  city: 'Ananindeua',
  state: 'PA',
  latitude: -1.35,
  longitude: -48.37,
} satisfies AddressSearchResult
