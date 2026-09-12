import type { Consumer } from '@custom_types/consumer/consumer'

export const useVerifyPhoneLinkMock: {
  request: { phone: string; code: string }
  consumer: Consumer
} = {
  request: { phone: '+5591988881234', code: '123456' },
  consumer: {
    id: 'consumer-1',
    name: 'Maria Silva',
    email: null,
    phone: '+5591988881234',
    photoUrl: null,
    cpf: null,
    isActive: true,
    lastLoginAt: '2026-08-27T12:00:00.000Z',
    profileCompletedAt: '2025-01-10T12:00:00.000Z',
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: '2025-01-10T12:00:00.000Z',
  },
}
