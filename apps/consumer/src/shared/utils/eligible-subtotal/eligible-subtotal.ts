import type { CartLine } from '@custom_types/cart/cart-line'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'

const lineTotal = (line: CartLine) =>
  (line.item.package?.listPrice ?? cartItemPrice(line.item)) * line.quantity

/** Soma da sacola, ou só dos itens da campanha quando ela restringe produtos. */
export const eligibleSubtotal = (
  cartLines: CartLine[],
  eligibleProductIds?: string[] | null
): number =>
  cartLines
    .filter(
      ({ item }) => !eligibleProductIds || eligibleProductIds.includes(item.id)
    )
    .reduce((total, line) => total + lineTotal(line), 0)
