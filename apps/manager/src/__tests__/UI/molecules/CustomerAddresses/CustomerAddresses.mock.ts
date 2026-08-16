import type { CustomerAddress } from '@custom_types/customer/customer-address'

export const primaryAddress: CustomerAddress = {
  id: 'address-1',
  zipCode: '01310100',
  street: 'Av. Paulista',
  number: '1000',
  complement: 'Apto 12',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  isPrimary: true,
}

export const secondaryAddress: CustomerAddress = {
  id: 'address-2',
  zipCode: '20040020',
  street: 'Av. Rio Branco',
  number: '156',
  complement: null,
  neighborhood: 'Centro',
  city: 'Rio de Janeiro',
  state: 'RJ',
  isPrimary: null,
}
