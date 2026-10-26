import type { AddressLookup } from '@nino/lib/types/address/address-lookup'
import type { Address } from '@custom_types/address/address'

export const addressFormMock: { lookup: AddressLookup; address: Address } = {
  lookup: {
    street: 'Rua das Flores',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
  },
  address: {
    id: 'address-1',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 12',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    zipCode: '01001000',
    isPrimary: true,
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: '2025-01-10T12:00:00.000Z',
  },
}
