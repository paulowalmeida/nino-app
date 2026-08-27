import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import type { CartLine } from '@shared/types/counter/cart-line'
import type { MenuItem } from '@shared/types/product/menu-item'

type CounterCart = {
  lines: CartLine[]
  count: number
  total: number
  add: (item: MenuItem) => void
  step: (productId: string, by: number) => void
  clear: () => void
}

export const useCounterCart = (): CounterCart => {
  const lines = useCounterStore((state) => state.lines)
  const add = useCounterStore((state) => state.add)
  const step = useCounterStore((state) => state.step)
  const clear = useCounterStore((state) => state.clear)

  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce(
      (sum, line) => sum + Number(line.unitPrice) * line.quantity,
      0
    ),
    add,
    step,
    clear,
  }
}
