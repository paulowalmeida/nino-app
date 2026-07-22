import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CartState } from '@custom_types/cart/cart-state'

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
        set((state) => {
          const total = (state.lines[item.id]?.quantity ?? 0) + quantity
          return {
            lines: { ...state.lines, [item.id]: { item, quantity: total } },
          }
        }),

      increment: (itemId) =>
        set((state) => {
          const line = state.lines[itemId]
          if (!line) return state
          return {
            lines: {
              ...state.lines,
              [itemId]: { ...line, quantity: line.quantity + 1 },
            },
          }
        }),

      decrement: (itemId) =>
        set((state) => {
          const line = state.lines[itemId]
          if (!line) return state

          if (line.quantity <= 1) {
            return {
              lines: Object.fromEntries(
                Object.entries(state.lines).filter(([id]) => id !== itemId)
              ),
            }
          }

          return {
            lines: {
              ...state.lines,
              [itemId]: { ...line, quantity: line.quantity - 1 },
            },
          }
        }),

      clear: () => set({ lines: {} }),
    }),
    {
      name: 'nino.cart',
      partialize: (state) => ({ lines: state.lines }),
    }
  )
)
