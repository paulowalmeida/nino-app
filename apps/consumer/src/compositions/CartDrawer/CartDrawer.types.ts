import type { CartLine } from '@custom_types/cart/cart-line'

export type CartDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lines: CartLine[]
  total: number
  /** Prazo da loja, o mesmo do cabeçalho — some quando não está configurado. */
  estimatedMinutes?: number
  onIncrement: (itemId: string) => void
  onDecrement: (itemId: string) => void
  onClear: () => void
  onCheckout: () => void
}
