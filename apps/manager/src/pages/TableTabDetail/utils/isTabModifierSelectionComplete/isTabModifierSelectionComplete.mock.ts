import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

export const completeSelectionModifiersMock = [
  { id: 'modifier-1', minSelections: 1, maxSelections: 1 },
  { id: 'modifier-2', minSelections: 0, maxSelections: 2 },
] as unknown as MenuItemModifier[]
