import type { UnitRole } from '@shared/types/auth/unit-role'
import type {
  StaffActivityEntry,
} from '@shared/types/team/staff-activity-entry'

export type StaffDetail = {
  user: {
    id: string
    name: string
    phone: string | null
    isActive: boolean
    lastLoginAt: string | null
    profileCompletedAt: string | null
    credentials: { provider: string; email: string | null }[]
  }
  role: UnitRole
  createdAt: string
  firstActivityAt: string | null
  ordersHandled: number
  revenueHandled: number
  statusChanges: number
  cancellations: number
  activity: StaffActivityEntry[]
}
