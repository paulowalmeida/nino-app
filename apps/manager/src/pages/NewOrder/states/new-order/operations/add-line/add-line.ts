import type { SetNewOrderState } from '@pages/NewOrder/types/SetNewOrderState.type'
import type { CartLine } from '@shared/types/counter/cart-line'

export const addLine = (
  set: SetNewOrderState,
  line: Omit<CartLine, 'quantity'>
) =>
  set((current) => {
    const found = current.lines.find(
      (item) => item.productId === line.productId
    )
    if (!found) return { lines: [...current.lines, { ...line, quantity: 1 }] }

    return {
      lines: current.lines.map((item) =>
        item.productId === line.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }
  })
