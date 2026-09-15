import type { UnitRole } from '@shared/types/auth/unit-role'

export type RosterEntry = {
  id: string
  name: string
  email: string | null
  role: string
  roleKey?: UnitRole
  roleLocked?: string
  href?: string
  lastLoginAt: string | null
  quiet?: boolean
  removable: boolean
  emailEditable?: boolean
}
