import type { CustomerHistory } from '@custom_types/customer/customer-history'
import type { Membership } from '@custom_types/auth/membership'

export const currentTenant: Pick<Membership, 'tenantId'> = {
  tenantId: 'tenant-1',
}

export const customerHistory: CustomerHistory = {
  id: 'customer-1',
  name: 'Ana Souza',
  phone: '11999990000',
  email: 'ana@example.com',
  cpf: '12345678900',
  loyaltyPoints: 10,
  since: '2026-01-01T00:00:00.000Z',
  orders: 3,
  spent: 150,
  lastOrderAt: '2026-07-01T00:00:00.000Z',
  addresses: [
    {
      id: 'address-1',
      zipCode: '01310100',
      street: 'Av. Paulista',
      number: '1000',
      complement: null,
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      isPrimary: true,
    },
  ],
  history: [],
}
