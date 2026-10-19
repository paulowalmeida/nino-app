import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'

export const previousAddressMock = {
  id: 'place-1',
  providerId: 'place-1',
  precision: 'point',
  zipCode: '67143-450',
  street: 'Travessa We 66',
  number: '1562',
  neighborhood: 'Coqueiro',
  city: 'Ananindeua',
  state: 'PA',
  latitude: -1.35,
  longitude: -48.37,
} satisfies AddressSearchResult

export const addressAtPinMock = {
  ...previousAddressMock,
  id: 'place-2',
  providerId: 'place-2',
  number: '',
  latitude: -1.36,
  longitude: -48.38,
} satisfies AddressSearchResult
