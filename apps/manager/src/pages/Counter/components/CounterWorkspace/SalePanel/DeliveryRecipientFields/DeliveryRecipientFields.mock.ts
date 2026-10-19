import type {
  AddressPrediction,
  AddressSearchResult,
} from '@nino/lib/types/address/address-lookup'

export const deliveryRecipientMock = {
  name: 'Ana',
  phone: '91988880000',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: 'Belém',
  state: 'PA',
  zipCode: '',
  zoneId: '',
}

export const addressPredictionMock = {
  placeId: 'place-1',
  description: 'Travessa WE-69-A - Coqueiro, Ananindeua - PA',
  mainText: 'Travessa WE-69-A',
  secondaryText: 'Coqueiro, Ananindeua - PA',
} satisfies AddressPrediction

export const addressSearchResultMock = {
  id: 'place-1',
  providerId: 'place-1',
  precision: 'point',
  zipCode: '67143-450',
  street: 'Travessa WE-69-A',
  number: '26',
  neighborhood: 'Coqueiro',
  city: 'Ananindeua',
  state: 'PA',
  latitude: -1.35,
  longitude: -48.37,
} satisfies AddressSearchResult

export const addressWithoutNumberMock = {
  ...addressSearchResultMock,
  number: '',
} satisfies AddressSearchResult

export const addressAtFirstPointMock = {
  ...addressSearchResultMock,
  id: 'place-2',
  providerId: 'place-2',
  street: 'Travessa WE-70',
  number: '',
  latitude: -1.36,
  longitude: -48.38,
} satisfies AddressSearchResult

export const addressAtSecondPointMock = {
  ...addressSearchResultMock,
  id: 'place-3',
  providerId: 'place-3',
  street: 'Travessa WE-71',
  number: '9',
  latitude: -1.37,
  longitude: -48.39,
} satisfies AddressSearchResult
