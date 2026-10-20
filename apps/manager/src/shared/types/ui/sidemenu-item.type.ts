import type { IconName } from '@nino/ds/components/Icon'
import type { UnitPermission } from '@shared/types/auth/unit-permission.type'

export type SidemenuItem = {
  title?: string
  items: {
    section: string
    label: string
    icon: IconName
    permission?: UnitPermission
    ownerOnly?: boolean
  }[]
}
