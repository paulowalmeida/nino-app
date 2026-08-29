import type { CSSProperties, ReactNode } from 'react'
import { Box } from '@nino/ds/components/Box'

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
  <Box className={`${styles.bar} ${className ?? ''}`} style={style}>
    <Box className={styles.inner}>{children}</Box>
  </Box>
)
