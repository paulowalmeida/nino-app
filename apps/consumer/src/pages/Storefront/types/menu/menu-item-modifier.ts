import type { MenuItemModifierOption } from './menu-item-modifier-option'

export type MenuItemModifier = {
  id: string
  name: string
  description: string | null
  isRequired: boolean
  maxSelections: number
  options: MenuItemModifierOption[]
}
