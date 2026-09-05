import type { MenuItemModifier } from '@custom_types/menu/menu-item-modifier'

export const choiceRuleLabel = (group: MenuItemModifier): string => {
  if (group.maxSelections === 1) return 'Escolha 1 opção'

  return `Escolha até ${group.maxSelections} opções`
}
