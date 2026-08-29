import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CartLine } from '@custom_types/cart/cart-line'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { addCartItem } from './operations/add-cart-item/add-cart-item'
import { clearCart } from './operations/clear-cart/clear-cart'
import { decrementCartItem } from './operations/decrement-cart-item/decrement-cart-item'
import { incrementCartItem } from './operations/increment-cart-item/increment-cart-item'

type CartState = {
  lines: Record<string, CartLine>
  add: (item: MenuItem, quantity?: number) => void
  increment: (itemId: string) => void
  decrement: (itemId: string) => void
  clear: () => void
}

/**
 * Sacola do cliente: precisa sobreviver à navegação até o checkout e a um
 * F5 no meio do caminho — por isso fica em localStorage, não só em memória.
 * Dados de menu/loja continuam com o TanStack Query — isto é só o que o
 * cliente escolheu.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: {},

      add: (item, quantity = 1) =>
        set((state) => ({ lines: addCartItem(state.lines, item, quantity) })),

      increment: (itemId) =>
        set((state) => ({ lines: incrementCartItem(state.lines, itemId) })),

      decrement: (itemId) =>
        set((state) => ({ lines: decrementCartItem(state.lines, itemId) })),

      clear: () => set({ lines: clearCart() }),
    }),
    {
      name: 'nino.cart',
      partialize: (state) => ({ lines: state.lines }),
    }
  )
)
