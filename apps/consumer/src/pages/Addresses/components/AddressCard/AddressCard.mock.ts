import type { Address } from '@custom_types/address/address'

export const addressCardMock: { address: Address } = {
  address: {
    id: 'address-1',
    street: 'Rua das Flores',
    number: '123',
    complement: null,
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
