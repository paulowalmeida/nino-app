import type { CourierMember } from './courier-member'
import type { StaffMember } from './staff-member'

type Page<T> = {
  data: T[]
  pagination: {
    total: number
  }
}

export type StaffPage = Page<StaffMember>

export type CourierPage = Page<CourierMember>
