import type { Customer } from '@custom_types/customer/customer'
import type { UpdateMyProfileRequest } from '@custom_types/customer/update-my-profile-request'

export const useCompleteProfileMock: {
  request: UpdateMyProfileRequest
  customer: Customer
} = {
  request: { name: 'Maria Silva', email: 'maria@example.com' },
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
  },
}
