import type { CSSProperties } from 'react'

/**
 * Tempo gasto do prazo (`--t`) e tamanho do atraso (`--o`), ambos de 0 a 1,
 * lidos pela fita do cartão.
 */
export const elapsedVar = (ratio: number, overdueRatio = 0): CSSProperties =>
  ({ '--t': ratio, '--o': overdueRatio }) as CSSProperties
