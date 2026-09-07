import type { IconName } from '@nino/ds/components/Icon'
import type { TenantRole } from '@shared/types/auth/tenant-role'

export type SidemenuItem = {
  title?: string
  items: {
    section: string
    label: string
    icon: IconName
    roles?: TenantRole[]
  }[]
}
