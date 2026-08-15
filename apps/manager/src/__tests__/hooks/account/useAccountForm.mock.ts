import type { Profile } from '@custom_types/account/profile'

export const profileWithEmail: Profile = {
  id: 'profile-1',
  name: 'Maria Silva',
  phone: '85999998888',
  locale: 'pt-BR',
  timezone: 'America/Fortaleza',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLoginAt: '2026-08-01T00:00:00.000Z',
  credentials: [
    {
      id: 'cred-1',
      userId: 'profile-1',
      email: 'maria@example.com',
      provider: 'local',
      providerCode: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
}
