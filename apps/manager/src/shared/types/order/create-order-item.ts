import type { CreateOrderItemModifier } from './create-order-item-modifier'

export type CreateOrderItem = {
  productId: string
  quantity: number
  unitPrice: number
  modifiers?: CreateOrderItemModifier[]
}
