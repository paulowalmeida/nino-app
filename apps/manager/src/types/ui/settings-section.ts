import type { NavIconName } from '@components/NavIcon/NavIcon.types'

/** Uma seção de tela com rota própria, listada no menu. */
export type SettingsSection = {
  to: string
  label: string
  hint: string
  icon: NavIconName
}
