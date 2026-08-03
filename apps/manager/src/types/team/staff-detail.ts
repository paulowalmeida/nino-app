import type { StaffMember } from './staff-member'
import type { StaffActivityEntry } from './staff-activity-entry'

export type StaffDetail = StaffMember & {
  ordersHandled: number
  lastActivityAt: string | null
  activity: StaffActivityEntry[]
}
