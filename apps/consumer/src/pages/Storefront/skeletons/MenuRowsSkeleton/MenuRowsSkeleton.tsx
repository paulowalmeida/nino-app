import styles from './MenuRowsSkeleton.module.css'
import { Box } from '@nino/ds/components/Box'

type MenuRowsSkeletonProps = {
  count?: number
}

/**
 * Placeholder do cardápio. Espelha a seção real: cabeçalho com nome e contagem,
 * e o `MenuItemCard` — foto, título, descrição e o preço ancorado no rodapé, na
 * mesma composição que o card assume em cada largura.
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
          <Box className={styles.skPhoto} />
          <Box className={styles.skText}>
            <Box className={styles.skItemName} />
            <Box className={styles.skItemDesc} />
            <Box className={styles.skItemPrice} />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
)
