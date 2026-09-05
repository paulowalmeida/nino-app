import type { ProductChoicesState } from './ProductChoicesState.type'

export type SetProductChoicesState = (
  partial:
    | Partial<ProductChoicesState>
    | ((state: ProductChoicesState) => Partial<ProductChoicesState>)
) => void
