import type { CSSProperties, ReactNode } from 'react'

import styles from './CategoryBar.module.css'

type CategoryBarProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * A moldura que gruda no topo ao rolar. O "grude" é dela, não de quem mora
 * dentro — a trilha de categorias só sabe ser uma trilha.
 */
export const CategoryBar = ({ children, className, style }: CategoryBarProps) => (
  <div className={`${styles.bar} ${className ?? ''}`} style={style}>
    <div className={styles.inner}>{children}</div>
  </div>
)
