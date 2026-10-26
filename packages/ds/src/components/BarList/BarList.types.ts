import { HTMLAttributes, ReactNode } from 'react'

export type BarListItem = {
  /** Chave estável — o nome pode repetir. */
  id: string
  label: string
  /** Grandeza que desenha a barra. Negativo não é suportado. */
  value: number
  /** O que aparece à direita. Ausente, mostra o próprio `value`. */
  display?: ReactNode
}

export type BarListProps = Omit<
  HTMLAttributes<HTMLOListElement>,
  'children'
> & {
  items: BarListItem[]
  /**
   * Teto da escala. Ausente, é o maior valor da lista — a barra do topo
   * enche, e as outras se leem em relação a ela.
   */
  max?: number
}
