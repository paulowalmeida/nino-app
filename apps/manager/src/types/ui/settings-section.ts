import type { IconName } from '@nino/ds/components/Icon'

/** Uma seção de tela com rota própria, listada no menu. */
export type SettingsSection = {
  to: string
  label: string
  hint: string
  icon: IconName
}
