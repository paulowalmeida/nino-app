import type { ConsumerHistory } from '@shared/types/consumer/consumer-history'

export const consumerDetailScopeMock = {
  tenantId: 'tenant-1',
  consumerId: 'consumer-1',
}

export const consumerDetailMock: ConsumerHistory = {
  id: 'consumer-1',
  name: 'Maria Clara Souza',
  phone: '11988887777',
  email: 'maria@example.com',
  cpf: '39053344705',
  loyaltyPoints: 120,
  since: '2024-03-10T12:00:00.000Z',
  orders: 12,
  spent: 890.5,
  lastOrderAt: '2026-02-10T18:30:00.000Z',
  addresses: [
    {
      id: 'address-primary',
      zipCode: '04543011',
      street: 'Rua Olimpíadas',
      number: '55',
      complement: null,
      neighborhood: 'Vila Olímpia',
      city: 'São Paulo',
      state: 'SP',
      isPrimary: true,
    },
  ],
  history: [],
}
