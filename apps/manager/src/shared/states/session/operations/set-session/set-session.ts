import type { AuthUser } from '@shared/types/auth/auth-user'
import type { Membership } from '@shared/types/auth/membership'

import type { SetSession } from '../../session.state'

export const setSession = (
  set: SetSession,
  user: AuthUser,
  memberships: Membership[]
) => set({ user, memberships })
