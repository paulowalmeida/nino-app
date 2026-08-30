import styles from './MenuRowsSkeleton.module.css'
import { Box } from '@nino/ds/components/Box'

type MenuRowsSkeletonProps = {
  count?: number
}

/**
 * Placeholder do cardápio. Espelha a seção real: cabeçalho com nome e contagem
 * sobre a divisória tracejada, e o `MenuItemCard` — linha simples com divisória
 * no celular, card emoldurado em grade de 2 colunas no desktop, com a foto e o
 * botão "+" ancorado no canto já no lugar.
 */
export const MenuRowsSkeleton = ({ count = 4 }: MenuRowsSkeletonProps) => (
  <Box aria-busy="true" aria-label="Carregando o cardápio">
    <Box className={styles.skSectionHead}>
      <Box className={styles.skSectionTitle} />
      <Box className={styles.skSectionCount} />
    </Box>

    <Box className={styles.skItems}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} className={styles.skRow}>
          <Box className={styles.skText}>
            <Box className={styles.skItemName} />
            <Box className={styles.skItemDesc} />
            <Box className={styles.skItemPrice} />
          </Box>
          <Box className={styles.skMedia}>
            <Box className={styles.skPhoto} />
            <Box className={styles.skAdd} />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
)
