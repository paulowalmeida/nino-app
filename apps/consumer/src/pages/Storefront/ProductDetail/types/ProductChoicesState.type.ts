import type { ProductChoiceSelections } from './ProductChoiceSelections.type'
import type { ProductEdit } from './ProductEdit.type'

export type ProductChoicesState = {
  productId: string | null
  /** Linha da sacola em edição; null quando a modal adiciona um item novo. */
  editingLineId: string | null
  selections: ProductChoiceSelections
  quantity: number
  notes: string
  isReplacementPending: boolean
  openProduct: (productId: string, editing?: ProductEdit) => void
  selectChoice: (groupId: string, optionId: string) => void
  toggleChoice: (groupId: string, optionId: string, limit: number) => void
  setQuantity: (quantity: number) => void
  setNotes: (notes: string) => void
  askReplacement: () => void
  dismissReplacement: () => void
  reset: () => void
}
