import type { Profile } from '@custom_types/account/profile'

const googleCredential = {
  id: 'credential-1',
  userId: 'user-1',
  email: 'marina@padariaboa.com',
  provider: 'google',
  providerCode: null,
  createdAt: '2026-03-12T12:00:00.000Z',
  updatedAt: '2026-03-12T12:00:00.000Z',
}

export const googleProfile: Profile = {
  id: 'user-1',
  name: 'Marina Prado',
  phone: '+5511988887777',
  locale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  createdAt: '2026-03-12T12:00:00.000Z',
  lastLoginAt: '2026-04-02T12:00:00.000Z',
  credentials: [googleCredential],
}

export const neverLoggedProfile: Profile = {
  ...googleProfile,
  name: 'Ana',
  lastLoginAt: null,
  credentials: [{ ...googleCredential, provider: 'local' }],
}
