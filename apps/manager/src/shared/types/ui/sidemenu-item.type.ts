import type { IconName } from '@nino/ds/components/Icon'
import type { UnitRole } from '@shared/types/auth/unit-role'

export type SidemenuItem = {
  title?: string
  items: {
    section: string
    label: string
    icon: IconName
    roles?: readonly UnitRole[]
  }[]
}
