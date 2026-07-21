import type { NavIconName } from '@components/NavIcon/NavIcon.types'
import type { TenantRole } from '@custom_types/auth'

export type NavItem = {
  section: string
  label: string
  icon: NavIconName
  /** Seções internas — aparecem quando o item está aberto. */
  children?: { to: string; label: string; icon: NavIconName }[]
  /** Papéis que enxergam o item; ausente = todo mundo da loja. */
  roles?: TenantRole[]
}
