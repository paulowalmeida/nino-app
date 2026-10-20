import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { CATEGORIES_GHOST_ICONS } from '@pages/CatalogCategories/constants/catalog-categories.constants'

import styles from './CategoriesHeaderSkeleton.module.css'

export const CategoriesHeaderSkeleton = () => (
  <>
    <Text role="status" className="sr-only">
      Carregando categorias
    </Text>

    <Box gap={2} mt={2} mb={{ mobile: 5, desktop: 8 }} aria-hidden="true">
      <Skeleton className={styles.title} />
      <Skeleton className={styles.description} />
    </Box>

    <Box gap={3} mb={6} aria-hidden="true">
      <Box
        direction={{ mobile: 'column', tablet: 'row' }}
        align={{ tablet: 'center' }}
        gap={2}
      >
        <Skeleton className={styles.input} />
        <Skeleton className={styles.button} />
      </Box>
      <Box direction="row" wrap gap={2}>
        {CATEGORIES_GHOST_ICONS.map((icon) => (
          <Skeleton key={icon} className={styles.icon} />
        ))}
      </Box>
    </Box>
  </>
)
