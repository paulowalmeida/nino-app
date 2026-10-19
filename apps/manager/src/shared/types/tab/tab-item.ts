import type { TabItemModifier } from './tab-item-modifier'

export type TabItem = {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  notes: string | null
  isCancelled: boolean
  cancelledAt: string | null
  modifiers: TabItemModifier[]
}
