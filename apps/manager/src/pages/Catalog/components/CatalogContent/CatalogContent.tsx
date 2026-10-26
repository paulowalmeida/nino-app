import { Box } from '@nino/ds/components/Box'
import { CatalogControls } from '@pages/Catalog/components/CatalogContent/CatalogControls/CatalogControls'
import { CatalogItems } from '@pages/Catalog/components/CatalogContent/CatalogItems/CatalogItems'

import styles from '@pages/Catalog/components/CatalogContent/CatalogContent.module.css'

export const CatalogContent = () => (
  <Box className={styles.wrap}>
    <CatalogControls />
    <CatalogItems className={styles.scroll} />
  </Box>
)
