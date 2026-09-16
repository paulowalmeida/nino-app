import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'
import type { CartLineModifier } from '@shared/types/counter/cart-line-modifier'
import type { MenuItem } from '@shared/types/product/menu-item'

const cartLineId = (productId: string, modifiers: CartLineModifier[]): string =>
  [productId, ...modifiers.map(({ optionId }) => optionId).sort()].join(':')

const cartLinePrice = (
  item: MenuItem,
  modifiers: CartLineModifier[]
): string => {
  const basePrice = item.pricingType === 'COMPOSED' ? 0 : Number(item.price)
  const modifiersPrice = modifiers.reduce(
    (total, modifier) => total + Number(modifier.unitPrice) * modifier.quantity,
    0
  )
  return String(basePrice + modifiersPrice)
}

export const addItem = (
  set: SetCounterState,
  item: MenuItem,
  modifiers: CartLineModifier[] = []
) =>
  set((state) => {
    const lineId = cartLineId(item.id, modifiers)
    const found = state.lines.find(
      (line) => (line.lineId ?? line.productId) === lineId
    )
    return {
      lines: found
        ? state.lines.map((line) =>
            (line.lineId ?? line.productId) === lineId
              ? { ...line, quantity: line.quantity + 1 }
              : line
          )
        : [
            ...state.lines,
            {
              lineId,
              productId: item.id,
              name: item.name,
              unitPrice: cartLinePrice(item, modifiers),
              quantity: 1,
              modifiers,
            },
          ],
    }
  })
