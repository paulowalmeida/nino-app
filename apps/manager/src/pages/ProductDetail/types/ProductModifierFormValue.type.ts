import type { ProductModifierOptionFormValue } from './ProductModifierOptionFormValue.type'

export type ProductModifierFormValue = {
  name: string
  description: string
  role: 'COMPOSITION' | 'ADDITION'
  minSelections: number
  maxSelections: number
  options: ProductModifierOptionFormValue[]
}
