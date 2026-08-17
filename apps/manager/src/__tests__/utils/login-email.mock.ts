import type { AuthUser } from '@custom_types/auth/auth-user'

export const userWithGoogleThenEmail: Pick<AuthUser, 'credentials'> = {
  credentials: [
    {
      id: 'credential-google',
      userId: 'user-1',
      email: null,
      provider: 'google',
      providerCode: 'google-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'credential-local',
      userId: 'user-1',
      email: 'joao@lojateste.com.br',
      provider: 'local',
      providerCode: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
}

export const userWithoutCredentials: Pick<AuthUser, 'credentials'> = {
  credentials: [],
}
