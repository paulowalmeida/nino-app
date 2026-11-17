import type { ProductChoiceSelections } from './ProductChoiceSelections.type'

/** Escolhas de uma linha da sacola reabertas na modal do produto. */
export type ProductEdit = {
  lineId: string
  selections: ProductChoiceSelections
  quantity: number
  notes: string
}
