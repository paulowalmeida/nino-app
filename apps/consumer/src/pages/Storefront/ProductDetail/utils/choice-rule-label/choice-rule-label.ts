import type { MenuItemModifier } from '@custom_types/menu/menu-item-modifier'

export const choiceRuleLabel = (group: MenuItemModifier): string => {
  const minimum = group.minSelections ?? (group.isRequired ? 1 : 0)
  if (minimum === group.maxSelections) {
    return `Escolha ${group.maxSelections} ${group.maxSelections === 1 ? 'opção' : 'opções'}`
  }
  if (minimum > 0) {
    return `Escolha de ${minimum} até ${group.maxSelections} opções`
  }

  return `Escolha até ${group.maxSelections} opções`
}
