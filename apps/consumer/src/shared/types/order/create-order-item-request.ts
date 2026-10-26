import type { CreateOrderItemModifierRequest } from './create-order-item-modifier-request'

export type CreateOrderItemRequest = {
  productId: string
  quantity: number
  unitPrice: number
  modifiers?: CreateOrderItemModifierRequest[]
  notes?: string
}
