import type { MenuItemModifierOption } from './menu-item-modifier-option'

export type MenuItemModifier = {
  id: string
  name: string
  description: string | null
  isRequired: boolean
  role?: 'COMPOSITION' | 'ADDITION'
  minSelections?: number
  maxSelections: number
  options: MenuItemModifierOption[]
}
