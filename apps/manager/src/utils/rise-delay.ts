import type { CSSProperties } from 'react'

/**
 * Staggered entrance delay, read through `--d` — the shared convention every
 * class in `motion.module.css` and `rise.module.css` reads to stagger.
 */
export const riseDelay = (delay: number): CSSProperties =>
  ({ '--d': `${delay}ms` }) as CSSProperties
