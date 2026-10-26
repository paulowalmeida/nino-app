import type { CartLine } from '@custom_types/cart/cart-line'
import type { CreateOrderItemRequest } from '@custom_types/order/create-order-item-request'

/**
 * WHY: o preço das opções não vai no corpo — a API resolve cada uma pelo
 * catálogo, então o pedido carrega só qual opção foi escolhida.
 */
export const orderItemsRequest = (
  cartLines: CartLine[]
): CreateOrderItemRequest[] =>
  cartLines
    .filter(({ item }) => !item.package)
    .map(({ item, quantity }) => ({
      productId: item.id,
      quantity,
      unitPrice: Number(item.price),
      modifiers: (item.modifiers ?? []).map((modifier) => ({
        optionId: modifier.optionId,
        quantity: modifier.quantity,
      })),
      notes: item.notes,
    }))
