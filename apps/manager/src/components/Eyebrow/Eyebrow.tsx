import type { EyebrowProps } from './Eyebrow.types'

import styles from './Eyebrow.module.css'

/** Rótulo de seção com o traço da landing — mesmo device, mesma escala. */
export const Eyebrow = ({ children, className }: EyebrowProps) => (
  <p className={className ? `${styles.eyebrow} ${className}` : styles.eyebrow}>
    {children}
  </p>
)
