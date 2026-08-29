import type { Address } from '@custom_types/address/address'

export const addressSaveRequestMock: {
  withComplement: Address
  noComplement: Address
} = {
  withComplement: {
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
  noComplement: {
    id: 'address-2',
    street: 'Avenida Central',
    number: '456',
    complement: null,
    neighborhood: 'Jardins',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    zipCode: '01310000',
    isPrimary: false,
    createdAt: '2025-02-15T12:00:00.000Z',
    updatedAt: '2025-02-15T12:00:00.000Z',
  },
}
