import type { Profile } from '@shared/types/profile/profile'

export const profile: Profile = {
  id: 'profile-1',
  name: 'Maria Silva',
  phone: '+5585999998888',
  locale: 'pt-BR',
  timezone: 'America/Fortaleza',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLoginAt: null,
  credentials: [
    {
      id: 'credential-1',
      userId: 'profile-1',
      email: 'maria@example.com',
      provider: 'password',
      providerCode: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
}
