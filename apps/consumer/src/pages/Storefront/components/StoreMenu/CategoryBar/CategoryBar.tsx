import type { CSSProperties, ReactNode } from 'react'
import { Box } from '@nino/ds/components/Box'

import styles from './CategoryBar.module.css'

type CategoryBarProps = {
  children: ReactNode
  /** Grudada no topo: as categorias viram abas de texto. */
  compact?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * A moldura que gruda no topo ao rolar. O "grude" é dela, não de quem mora
 * dentro — a trilha de categorias só sabe ser uma trilha.
 */
export const CategoryBar = ({
  children,
  compact = false,
  className,
  style,
}: CategoryBarProps) => (
  <Box
    className={`${styles.bar} ${compact ? styles.barCompact : ''} ${className ?? ''}`}
    style={style}
  >
    <Box className={styles.categoryBarInner}>{children}</Box>
  </Box>
)
