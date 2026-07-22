import type { ReactNode } from 'react'

export type NinoLogoProps = {
  className?: string
  tone?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  mark?: ReactNode
  /** Quando presente, o logo vira link para esse destino. Sem ele (auth), fica estático. */
  to?: string
  /** Esconde o nome por extenso, deixando só a marca — sidebar colapsada. */
  hideWordmark?: boolean
}
