import type { Customer } from '@custom_types/customer/customer'

export const useProfileFacadeMock = {
  customer: {
    id: 'customer-1',
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '11987654321',
    photoUrl: null,
    cpf: null,
    isActive: true,
    lastLoginAt: '2026-08-27T12:00:00.000Z',
    profileCompletedAt: '2025-01-10T12:00:00.000Z',
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: '2025-01-10T12:00:00.000Z',
  } satisfies Customer,
}
