import type { Consumer } from '@custom_types/consumer/consumer'

export const useAccountLayoutFacadeMock = {
  consumer: {
    id: 'consumer-1',
    name: 'Maria Silva',
    phone: '11999999999',
    email: 'maria@example.com',
    photoUrl: null,
    cpf: null,
    isActive: true,
    lastLoginAt: '2026-08-27T12:00:00.000Z',
    profileCompletedAt: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  } satisfies Consumer,
}
