import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import styles from './StorefrontSkeleton.module.css'

import { MenuRowsSkeleton } from '@pages/Storefront/skeletons/MenuRowsSkeleton/MenuRowsSkeleton'
import { StoreHeaderSkeleton } from '@pages/Storefront/skeletons/StoreHeaderSkeleton/StoreHeaderSkeleton'

/** Larguras variadas pros chips, imitando nomes de categoria de tamanhos
 * diferentes. */
const chipWidths = [
  styles.skChipM,
  styles.skChipL,
  styles.skChipS,
  styles.skChipM,
]

/**
 * Espelha a forma real da vitrine: faixa da loja, identidade, busca, régua de
 * categorias e a grade de itens. Reusa as mesmas classes de layout do conteúdo
 * real, então a página não salta ao trocar o placeholder pelo cardápio.
 */
export const StorefrontSkeleton = () => (
  <Box className={styles.storefrontSkeletonPage} aria-busy="true" aria-label="Carregando a loja">
    <StoreHeaderSkeleton showBanner showSearch />

    <Box className={styles.storefrontSkeletonShell}>
      <Box className={styles.skTrack}>
        {chipWidths.map((width, index) => (
          <Text
            as="span"
            key={index}
            className={`${styles.skChip} ${width}`}
            aria-hidden="true"
          />
        ))}
      </Box>

      <MenuRowsSkeleton />
    </Box>
  </Box>
)
