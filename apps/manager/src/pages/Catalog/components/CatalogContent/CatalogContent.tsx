import { Box } from '@nino/ds/components/Box'
import { CatalogControls } from '@pages/Catalog/components/CatalogContent/CatalogControls/CatalogControls'
import { CatalogItems } from '@pages/Catalog/components/CatalogContent/CatalogItems/CatalogItems'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import { CatalogContentSkeleton } from '@pages/Catalog/skeletons/CatalogContent/CatalogContentSkeleton'
import { useProductImagesReady } from '@shared/hooks/product/useProductImagesReady/useProductImagesReady'

import styles from '@pages/Catalog/components/CatalogContent/CatalogContent.module.css'

export const CatalogContent = () => {
  const { items } = useCatalogFacade()
  const areImagesReady = useProductImagesReady(items)

  if (!areImagesReady) return <CatalogContentSkeleton />

  return (
    <Box className={styles.wrap}>
      <CatalogControls />
      <CatalogItems className={styles.scroll} />
    </Box>
  )
}
