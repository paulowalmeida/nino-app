import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'
import type { MenuItem } from '@shared/types/product/menu-item'

export const addItem = (set: SetCounterState, item: MenuItem) =>
  set((state) => {
    const found = state.lines.find(({ productId }) => productId === item.id)
    return {
      lines: found
        ? state.lines.map((line) =>
            line.productId === item.id
              ? { ...line, quantity: line.quantity + 1 }
              : line
          )
        : [
            ...state.lines,
            {
              productId: item.id,
              name: item.name,
              unitPrice: item.price,
              quantity: 1,
            },
          ],
    }
  })
