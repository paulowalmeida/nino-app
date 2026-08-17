import type { StaffMember } from './staff-member'
import type { StaffActivityEntry } from './staff-activity-entry'

export type StaffDetail = StaffMember & {
  ordersHandled: number
  revenueHandled: number
  statusChanges: number
  cancellations: number
  firstActivityAt: string | null
  lastActivityAt: string | null
  activity: StaffActivityEntry[]
}
