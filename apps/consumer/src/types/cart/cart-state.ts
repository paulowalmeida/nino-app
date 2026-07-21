import type { MenuItem } from '@custom_types/menu/menu-item'

import type { CartLine } from './cart-line'

export type CartState = {
  lines: Record<string, CartLine>
  add: (item: MenuItem, quantity?: number) => void
  increment: (itemId: string) => void
  decrement: (itemId: string) => void
  clear: () => void
}
