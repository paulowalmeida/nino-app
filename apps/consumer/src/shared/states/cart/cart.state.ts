import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CartLine } from '@custom_types/cart/cart-line'
import type { CartItem } from '@custom_types/cart/cart-item'
import { addCartItem } from './operations/add-cart-item/add-cart-item'
import { clearCart } from './operations/clear-cart/clear-cart'
import { decrementCartItem } from './operations/decrement-cart-item/decrement-cart-item'
import { incrementCartItem } from './operations/increment-cart-item/increment-cart-item'

type CartState = {
  tenantId: string | null
  lines: Record<string, CartLine>
  add: (tenantId: string, item: CartItem, quantity?: number) => boolean
  replace: (tenantId: string, item: CartItem, quantity?: number) => void
  increment: (itemId: string) => void
  decrement: (itemId: string) => void
  clear: () => void
}

/**
 * Sacola do cliente: precisa sobreviver à navegação até o checkout e a um
 * F5 no meio do caminho — por isso fica em localStorage, não só em memória.
 * O tenant impede que escolhas de lojas diferentes se misturem. A linha
 * persiste só o snapshot necessário para a sacola; preço e disponibilidade
 * continuam sendo revalidados pela API ao criar o pedido.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tenantId: null,
      lines: {},

      add: (tenantId, item, quantity = 1) => {
        const current = get()
        if (current.tenantId && current.tenantId !== tenantId) return false

        set((state) => ({
          tenantId,
          lines: addCartItem(state.lines, item, quantity),
        }))
        return true
      },

      replace: (tenantId, item, quantity = 1) =>
        set({ tenantId, lines: addCartItem({}, item, quantity) }),

      increment: (itemId) =>
        set((state) => ({ lines: incrementCartItem(state.lines, itemId) })),

      decrement: (itemId) =>
        set((state) => {
          const lines = decrementCartItem(state.lines, itemId)
          return {
            lines,
            tenantId: Object.keys(lines).length === 0 ? null : state.tenantId,
          }
        }),

      clear: () => set({ tenantId: null, lines: clearCart() }),
    }),
    {
      name: 'nino.cart',
      version: 2,
      migrate: (persisted, version) =>
        version < 2 ? { tenantId: null, lines: {} } : (persisted as CartState),
      partialize: (state) => ({
        tenantId: state.tenantId,
        lines: state.lines,
      }),
    }
  )
)
