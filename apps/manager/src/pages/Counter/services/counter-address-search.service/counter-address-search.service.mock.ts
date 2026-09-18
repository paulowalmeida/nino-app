import type {
  AddressPrediction,
  AddressSearchResult,
} from '@nino/lib/types/address/address-lookup'

export const counterAddressSearchParamsMock = {
  unitId: 'f3c99db0-8c56-4e84-a843-a8092c77038b',
  state: 'PA',
  street: 'WE-69-A',
  sessionToken: 'session-token-1',
}

export const counterAddressPredictionsMock = [
  {
    placeId: 'place-we69a',
    description: 'Travessa WE-69-A - Coqueiro, Ananindeua - PA',
    mainText: 'Travessa WE-69-A',
    secondaryText: 'Coqueiro, Ananindeua - PA',
  },
] satisfies AddressPrediction[]

export const counterAddressSearchResultMock = {
  id: 'place-we69a',
  providerId: 'place-we69a',
  precision: 'point',
  zipCode: '67143-450',
  street: 'Travessa WE-69-A',
  neighborhood: 'Coqueiro',
  city: 'Ananindeua',
  state: 'PA',
  latitude: -1.35,
  longitude: -48.37,
} satisfies AddressSearchResult
