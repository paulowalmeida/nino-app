import type { TabModifierSelection } from '@pages/TableTabDetail/types/TabModifierSelection.type'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

export const isTabModifierSelectionComplete = (
  modifiers: MenuItemModifier[],
  selection: TabModifierSelection
): boolean =>
  modifiers.every(({ id, minSelections, maxSelections }) => {
    const chosenCount = selection[id]?.length ?? 0

    return chosenCount >= minSelections && chosenCount <= maxSelections
  })
