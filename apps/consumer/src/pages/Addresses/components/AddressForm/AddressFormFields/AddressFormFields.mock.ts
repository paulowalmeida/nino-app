import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

export const addressFormFieldsMock = {
  values: {
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  } satisfies SaveAddressRequest,
}

export const typedAddressMock = {
  zipCode: '',
  street: 'Rua das Flores',
  number: '26',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
} satisfies SaveAddressRequest

export const pickedAddressMock = {
  id: 'place-1',
  providerId: 'place-1',
  precision: 'point' as const,
  zipCode: '66000-000',
  street: 'Rua das Flores',
  number: '26',
  neighborhood: 'Centro',
  city: 'Belém',
  state: 'PA',
  latitude: -1.45,
  longitude: -48.5,
}

export const addressFieldSuggestionMock = {
  placeId: 'place-1',
  description: 'Rua das Flores, 26 - Centro, Belém - PA',
  mainText: 'Rua das Flores, 26',
  secondaryText: 'Centro, Belém - PA',
}
