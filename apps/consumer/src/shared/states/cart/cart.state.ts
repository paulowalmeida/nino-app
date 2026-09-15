import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CartLine } from '@custom_types/cart/cart-line'
import type { CartItem } from '@custom_types/cart/cart-item'
import { addCartItem } from './operations/add-cart-item/add-cart-item'
import { clearCart } from './operations/clear-cart/clear-cart'
import { decrementCartItem } from './operations/decrement-cart-item/decrement-cart-item'
import { incrementCartItem } from './operations/increment-cart-item/increment-cart-item'

type CartState = {
  unitId: string | null
  lines: Record<string, CartLine>
  add: (unitId: string, item: CartItem, quantity?: number) => boolean
  replace: (unitId: string, item: CartItem, quantity?: number) => void
  increment: (lineId: string) => void
  decrement: (lineId: string) => void
  clear: () => void
}

/**
 * Sacola do cliente: precisa sobreviver à navegação até o checkout e a um
 * F5 no meio do caminho — por isso fica em localStorage, não só em memória.
 * O unit impede que escolhas de lojas diferentes se misturem. A linha
 * persiste só o snapshot necessário para a sacola; preço e disponibilidade
 * continuam sendo revalidados pela API ao criar o pedido.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      unitId: null,
      lines: {},

      add: (unitId, item, quantity = 1) => {
        const current = get()
        if (current.unitId && current.unitId !== unitId) return false

        set((state) => ({
          unitId,
          lines: addCartItem(state.lines, item, quantity),
        }))
        return true
      },

      replace: (unitId, item, quantity = 1) =>
        set({ unitId, lines: addCartItem({}, item, quantity) }),

      increment: (lineId) =>
        set((state) => ({ lines: incrementCartItem(state.lines, lineId) })),

      decrement: (lineId) =>
        set((state) => {
          const lines = decrementCartItem(state.lines, lineId)
          return {
            lines,
            unitId: Object.keys(lines).length === 0 ? null : state.unitId,
          }
        }),

      clear: () => set({ unitId: null, lines: clearCart() }),
    }),
    {
      name: 'nino.cart',
      version: 3,
      migrate: (persisted, version) =>
        version < 3 ? { unitId: null, lines: {} } : (persisted as CartState),
      partialize: (state) => ({
        unitId: state.unitId,
        lines: state.lines,
      }),
    }
  )
)
