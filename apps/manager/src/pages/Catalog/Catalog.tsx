import { Box } from '@nino/ds/components/Box'
import { CatalogContent } from '@pages/Catalog/components/CatalogContent/CatalogContent'
import { CatalogDeleteItemDialog } from '@pages/Catalog/components/CatalogDeleteItemDialog/CatalogDeleteItemDialog'
import { CatalogDeleteItemsDialog } from '@pages/Catalog/components/CatalogDeleteItemsDialog/CatalogDeleteItemsDialog'
import { CatalogHeader } from '@pages/Catalog/components/CatalogHeader/CatalogHeader'
import { CatalogLoadError } from '@pages/Catalog/components/CatalogLoadError/CatalogLoadError'
import { MenuBoardEmptyState } from '@pages/Catalog/components/MenuBoardEmptyState/MenuBoardEmptyState'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import { CatalogContentSkeleton } from '@pages/Catalog/skeletons/CatalogContent/CatalogContentSkeleton'

import styles from '@pages/Catalog/Catalog.module.css'

export const Catalog = () => {
  const { items, status } = useCatalogFacade()
  const isPending = status === 'loading'
  const isError = status === 'error'
  const isEmpty = !isPending && !isError && items.length === 0

  return (
    <Box className={styles.page}>
      <CatalogHeader />

      {isPending && <CatalogContentSkeleton />}

      {isError && <CatalogLoadError />}

      {isEmpty && <MenuBoardEmptyState />}

      {!isPending && !isError && !isEmpty && <CatalogContent />}

      <CatalogDeleteItemDialog />
      <CatalogDeleteItemsDialog />
    </Box>
  )
}
