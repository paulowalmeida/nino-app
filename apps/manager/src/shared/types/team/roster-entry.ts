import type { PromotionOption } from '@shared/types/team/promotion-option.type'

export type RosterEntry = {
  id: string
  kind: 'STAFF' | 'COURIER'
  name: string
  email: string | null
  role: string
  promotionOptions?: PromotionOption[]
  roleLocked?: string
  href?: string
  lastLoginAt: string | null
  quiet?: boolean
  removable: boolean
  emailEditable?: boolean
}
