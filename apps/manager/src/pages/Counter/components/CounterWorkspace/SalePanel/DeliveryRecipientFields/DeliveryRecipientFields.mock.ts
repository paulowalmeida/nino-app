import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'

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

export const addressSuggestionMock = {
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
} satisfies AddressSearchResult
