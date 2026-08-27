import type { Transition } from 'framer-motion'

/**
 * O tempo do rearranjo, igual em toda lista arrastável do painel — itens do
 * cardápio e categorias. Sem transição explícita o framer usa uma mola, que
 * balança a linha depois de assentar; a curva aqui freia sem quicar.
 */
export const REORDER_TRANSITION: Transition = {
  duration: 0.32,
  ease: [0.16, 1, 0.3, 1],
}
