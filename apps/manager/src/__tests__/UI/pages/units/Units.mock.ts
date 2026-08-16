import type { AuthUser } from '@custom_types/auth/auth-user'

export const userWithName: Pick<AuthUser, 'id' | 'name'> = {
  id: 'user-1',
  name: 'Paulo Almeida',
}
