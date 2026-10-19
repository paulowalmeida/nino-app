import type { TabItem } from '@shared/types/tab/tab-item'

export const tabItemTotal = ({
  quantity,
  unitPrice,
  modifiers,
}: Pick<TabItem, 'quantity' | 'unitPrice' | 'modifiers'>): number => {
  const unitWithModifiers = modifiers.reduce(
    (price, modifier) => price + modifier.unitPrice * modifier.quantity,
    unitPrice
  )

  return Math.round(unitWithModifiers * quantity * 100) / 100
}
