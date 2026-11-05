export const addressFieldMock = { zipCode: '66000-000', number: '123' }

export const typedStoreAddressMock = {
  city: 'Belém',
  state: 'PA',
  street: 'Rua das Flores',
  number: '26',
}

export const pickedStoreAddressMock = {
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

export const storeAddressSuggestionMock = {
  placeId: 'place-1',
  description: 'Rua das Flores, 26 - Centro, Belém - PA',
  mainText: 'Rua das Flores, 26',
  secondaryText: 'Centro, Belém - PA',
}
