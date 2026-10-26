import type { ProductChoiceSelections } from './ProductChoiceSelections.type'

export type ProductChoicesState = {
  productId: string | null
  selections: ProductChoiceSelections
  quantity: number
  notes: string
  isReplacementPending: boolean
  openProduct: (productId: string) => void
  selectChoice: (groupId: string, optionId: string) => void
  toggleChoice: (groupId: string, optionId: string, limit: number) => void
  setQuantity: (quantity: number) => void
  setNotes: (notes: string) => void
  askReplacement: () => void
  dismissReplacement: () => void
  reset: () => void
}
