import { useCartStore } from '@shared/states/cart/cart.state'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'

/** A sacola pronta pro consumo da tela — já com contagem e total somados. */
export const useCartSummary = () => {
  const unitId = useCartStore((state) => state.unitId)
  const lines = useCartStore((state) => state.lines)
  const add = useCartStore((state) => state.add)
  const replace = useCartStore((state) => state.replace)
  const increment = useCartStore((state) => state.increment)
  const decrement = useCartStore((state) => state.decrement)
  const clear = useCartStore((state) => state.clear)

  const cartLines = Object.values(lines)
  const count = cartLines.reduce((total, line) => total + line.quantity, 0)
  const total = cartLines.reduce(
    (sum, line) => sum + cartItemPrice(line.item) * line.quantity,
    0
  )

  return {
    unitId,
    lines,
    cartLines,
    count,
    total,
    add,
    replace,
    increment,
    decrement,
    clear,
  }
}
