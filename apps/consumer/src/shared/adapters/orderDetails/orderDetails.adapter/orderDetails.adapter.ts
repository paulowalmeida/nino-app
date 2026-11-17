import type {
  OrderDetails,
  OrderDetailsAddress,
} from '@custom_types/order/order-details'

/** Campos da comanda no formato que a API devolve (`my/orders/:id` e `orders/guest/:id/status`). */
type OrderDetailsSourceItem = {
  id: string
  quantity: number
  unitPrice: string
  notes: string | null
  status: 'ACTIVE' | 'CANCELLED'
  isGift: boolean
  product: { name: string }
  modifiers: {
    quantity: number
    unitPrice: string
    option: { name: string }
  }[]
}

export type OrderDetailsSource = {
  items?: OrderDetailsSourceItem[]
  subtotal?: string
  deliveryFee?: string
  deliveryDiscount?: string
  promotionDiscount?: string
  loyaltyDiscount?: string
  totalAmount?: string
  paymentMethod?: OrderDetails['paymentMethod']
  paymentStatus?: OrderDetails['paymentStatus']
  changeFor?: string | null
  deliveryAddress?: OrderDetailsAddress | null
  deliveryZoneName?: string | null
  tableNumber?: string | null
  pickupCode?: string | null
  notes?: string | null
}

export const toOrderDetails = (
  order: OrderDetailsSource
): OrderDetails | undefined => {
  if (!order.items || !order.totalAmount || !order.paymentMethod) {
    return undefined
  }

  return {
    items: order.items
      .filter((item) => item.status !== 'CANCELLED')
      .map((item) => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        isGift: item.isGift,
        modifiers: item.modifiers.map((modifier) => ({
          name: modifier.option.name,
          quantity: modifier.quantity,
          unitPrice: modifier.unitPrice,
        })),
      })),
    subtotal: order.subtotal ?? order.totalAmount,
    deliveryFee: order.deliveryFee ?? '0',
    deliveryDiscount: order.deliveryDiscount ?? '0',
    promotionDiscount: order.promotionDiscount ?? '0',
    loyaltyDiscount: order.loyaltyDiscount ?? '0',
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus ?? 'PENDING',
    changeFor: order.changeFor ?? null,
    deliveryAddress: order.deliveryAddress ?? null,
    deliveryZoneName: order.deliveryZoneName ?? null,
    tableNumber: order.tableNumber ?? null,
    pickupCode: order.pickupCode ?? null,
    notes: order.notes ?? null,
  }
}
