import type { PaymentMethod } from './payment-method'

export type OrderDetailsItem = {
  id: string
  name: string
  quantity: number
  /** Preço unitário do item, em string decimal (como o Prisma serializa). */
  unitPrice: string
  notes: string | null
  isGift: boolean
  modifiers: { name: string; quantity: number; unitPrice: string }[]
}

export type OrderDetailsAddress = {
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
}

/**
 * A comanda inteira, devolvida por `my/orders/:id` (cliente logado) e por
 * `orders/guest/:id/status` (visitante, com o token do pedido).
 */
export type OrderDetails = {
  items: OrderDetailsItem[]
  subtotal: string
  deliveryFee: string
  deliveryDiscount: string
  promotionDiscount: string
  loyaltyDiscount: string
  totalAmount: string
  paymentMethod: PaymentMethod
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  changeFor: string | null
  deliveryAddress: OrderDetailsAddress | null
  deliveryZoneName: string | null
  tableNumber: string | null
  pickupCode: string | null
  notes: string | null
}
