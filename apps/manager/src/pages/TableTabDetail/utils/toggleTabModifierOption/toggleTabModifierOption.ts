import type { TabModifierSelection } from '@pages/TableTabDetail/types/TabModifierSelection.type'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

export const toggleTabModifierOption = (
  selection: TabModifierSelection,
  modifier: Pick<MenuItemModifier, 'id' | 'maxSelections'>,
  optionId: string,
  isChecked: boolean
): TabModifierSelection => {
  const chosenOptionIds = selection[modifier.id] ?? []

  if (modifier.maxSelections === 1) {
    return { ...selection, [modifier.id]: isChecked ? [optionId] : [] }
  }

  const nextOptionIds = isChecked
    ? [...new Set([...chosenOptionIds, optionId])]
    : chosenOptionIds.filter((chosenId) => chosenId !== optionId)

  return {
    ...selection,
    [modifier.id]: nextOptionIds.slice(0, modifier.maxSelections),
  }
}
