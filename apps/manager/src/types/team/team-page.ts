import type { CourierMember } from './courier-member'
import type { Page } from './page'
import type { StaffMember } from './staff-member'

export type StaffPage = Page<StaffMember>

export type CourierPage = Page<CourierMember>
