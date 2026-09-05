import type { ReplaceProductModifierOptionRequest } from './replace-product-modifier-option-request'

export type ReplaceProductModifierRequest = {
  name: string
  description?: string
  role: 'COMPOSITION' | 'ADDITION'
  minSelections: number
  maxSelections: number
  options: ReplaceProductModifierOptionRequest[]
}
