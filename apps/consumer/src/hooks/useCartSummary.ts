import { useCartStore } from '@states/useCartStore'

/** A sacola pronta pro consumo da tela — já com contagem e total somados. */
export const useCartSummary = () => {
  const lines = useCartStore((state) => state.lines)
  const add = useCartStore((state) => state.add)
  const increment = useCartStore((state) => state.increment)
  const decrement = useCartStore((state) => state.decrement)
  const clear = useCartStore((state) => state.clear)

  const cartLines = Object.values(lines)
  const count = cartLines.reduce((total, line) => total + line.quantity, 0)
  const total = cartLines.reduce(
    (sum, line) => sum + Number(line.item.price) * line.quantity,
    0
  )

  return { lines, cartLines, count, total, add, increment, decrement, clear }
}
