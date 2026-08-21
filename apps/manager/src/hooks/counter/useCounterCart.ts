import { useState } from 'react'

import type { CartLine } from '@custom_types/counter/cart-line'
import type { MenuItem } from '@custom_types/product/menu-item'

type CounterCart = {
  lines: CartLine[]
  count: number
  total: number
  add: (item: MenuItem) => void
  step: (productId: string, by: number) => void
  clear: () => void
}

export const useCounterCart = (): CounterCart => {
  const [lines, setLines] = useState<CartLine[]>([])

  const add = (item: MenuItem) =>
    setLines((current) => {
      const found = current.find(({ productId }) => productId === item.id)

      if (!found) {
        return [
          ...current,
          {
            productId: item.id,
            name: item.name,
            unitPrice: item.price,
            quantity: 1,
          },
        ]
      }

      return current.map((line) =>
        line.productId === item.id
          ? { ...line, quantity: line.quantity + 1 }
          : line
      )
    })

  const step = (productId: string, by: number) =>
    setLines((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + by }
            : line
        )
        .filter(({ quantity }) => quantity > 0)
    )

  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce(
      (sum, line) => sum + Number(line.unitPrice) * line.quantity,
      0
    ),
    add,
    step,
    clear: () => setLines([]),
  }
}
