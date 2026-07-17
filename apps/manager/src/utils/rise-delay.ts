import type { CSSProperties } from 'react'

/** Staggered entrance delay (`motion.rise`), read through `--d` in the CSS. */
export const riseDelay = (delay: number): CSSProperties =>
  ({ '--d': `${delay}ms` }) as CSSProperties
