import type { StaffMember } from './staff-member'

export type StaffPage = {
  data: StaffMember[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
