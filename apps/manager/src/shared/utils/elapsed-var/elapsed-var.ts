import type { CSSProperties } from 'react'

/** Tempo gasto do prazo (0–1), lido pela fita do cartão através de `--t`. */
export const elapsedVar = (ratio: number): CSSProperties =>
  ({ '--t': ratio }) as CSSProperties
