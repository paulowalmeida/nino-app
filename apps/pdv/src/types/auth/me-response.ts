import type { AuthUser } from './auth-user'
import type { Membership } from './membership'

export type MeResponse = AuthUser & {
  memberships: Membership[]
}
