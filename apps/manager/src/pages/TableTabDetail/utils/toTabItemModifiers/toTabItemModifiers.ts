import type { TabModifierSelection } from '@pages/TableTabDetail/types/TabModifierSelection.type'

export const toTabItemModifiers = (
  selection: TabModifierSelection
): { optionId: string; quantity: number }[] =>
  Object.values(selection)
    .flat()
    .map((optionId) => ({ optionId, quantity: 1 }))
