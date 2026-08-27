import type { NewOrderState } from './NewOrderState.type'

export type NewOrderDraft = NewOrderState & {
  subtotal: number
}
