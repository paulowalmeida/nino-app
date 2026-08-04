import type { AddressLookup } from '@nino/lib/types/address'

export const foundAddress: AddressLookup = {
  street: 'Rua das Flores',
  neighborhood: 'Centro',
  city: 'Fortaleza',
  state: 'CE',
}

export const emptyAddressValue = {
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}
