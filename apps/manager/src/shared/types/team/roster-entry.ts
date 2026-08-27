import type { TenantRole } from '@shared/types/auth/tenant-role'

export type RosterEntry = {
  id: string
  name: string
  email: string | null
  role: string
  roleKey?: TenantRole
  roleLocked?: string
  href?: string
  lastLoginAt: string | null
  quiet?: boolean
  removable: boolean
  emailEditable?: boolean
}
