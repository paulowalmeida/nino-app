import type { AuthUser } from '@custom_types/auth/auth-user'

export const loginEmailOf = (user: AuthUser): string | null =>
  user.credentials.find(({ email }) => !!email)?.email ?? null
