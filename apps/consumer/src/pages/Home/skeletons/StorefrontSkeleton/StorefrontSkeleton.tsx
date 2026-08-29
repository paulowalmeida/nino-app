import identityStyles from '@pages/Home/components/HomeContent/StoreIdentity/StoreIdentity.module.css'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import styles from './StorefrontSkeleton.module.css'

import { MenuRowsSkeleton } from '@pages/Home/skeletons/MenuRowsSkeleton/MenuRowsSkeleton'

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
  <Box className={styles.page} aria-busy="true" aria-label="Carregando a loja">
    <Box className={styles.skBanner} />

    <Box className={styles.shell}>
      <Box className={identityStyles.identityRow}>
        <Box className={styles.skLogo} />
        <Box className={styles.skLines}>
          <Box className={styles.skName} />
          <Box className={styles.skMeta} />
        </Box>
      </Box>

      <Box className={styles.skSearch} />

      <Box className={styles.skTrack}>
        {chipWidths.map((width, index) => (
          <Text as="span" key={index} className={`${styles.skChip} ${width}`} aria-hidden="true" />
        ))}
      </Box>

      <MenuRowsSkeleton />
    </Box>
  </Box>
)
