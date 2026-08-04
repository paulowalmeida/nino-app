import type { TenantRole } from '@custom_types/auth'

export type RosterEntry = {
  id: string
  name: string
  email: string | null
  /** Role in the store or status — what this person is here. */
  role: string
  /** Raw role, when the row allows switching jobs. */
  roleKey?: TenantRole
  /** Reason the role is locked, when it is. */
  roleLocked?: string
  /** Route to this person's profile. Without it, the name isn't a link. */
  href?: string
  /** Last sign-in, ISO or null for an account that never signed in. */
  lastLoginAt: string | null
  /** Quiet mark for people who don't operate the panel. */
  quiet?: boolean
  removable: boolean
  /** Whether this entry's e-mail can be edited from the roster. */
  emailEditable?: boolean
}
