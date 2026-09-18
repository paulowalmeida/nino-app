import type {
  AddressPrediction,
  AddressSearchResult,
} from '@nino/lib/types/address/address-lookup'

export const addressPredictionsMock = [
  {
    placeId: 'place-1',
    description: 'Rua das Flores - Centro, Belém - PA',
    mainText: 'Rua das Flores',
    secondaryText: 'Centro, Belém - PA',
  },
] satisfies AddressPrediction[]

export const addressSearchResultMock = {
  id: 'place-1',
  providerId: 'place-1',
  precision: 'point',
  zipCode: '66000-000',
  street: 'Rua das Flores',
  neighborhood: 'Centro',
  city: 'Belém',
  state: 'PA',
  latitude: -1.45,
  longitude: -48.5,
} satisfies AddressSearchResult
