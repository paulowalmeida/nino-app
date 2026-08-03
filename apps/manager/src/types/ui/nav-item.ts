import type { IconName } from '@nino/ds/components/Icon'
import type { TenantRole } from '@custom_types/auth'

export type NavItem = {
  section: string
  label: string
  icon: IconName
  /** Seções internas — aparecem quando o item está aberto. */
  children?: { to: string; label: string; icon: IconName }[]
  /** Papéis que enxergam o item; ausente = todo mundo da loja. */
  roles?: TenantRole[]
}
