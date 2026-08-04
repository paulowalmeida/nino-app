import type { TenantRole } from '@custom_types/auth'
import type { IconName } from '@nino/ds/components/Icon'

export type NavItem = {
  section: string
  label: string
  icon: IconName
  children?: { to: string; label: string; icon: IconName }[]
  roles?: TenantRole[]
}
