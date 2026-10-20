import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { CategoriesEmptyState } from '@pages/CatalogCategories/components/CategoriesEmptyState/CategoriesEmptyState'
import { CategoriesHeader } from '@pages/CatalogCategories/components/CategoriesHeader/CategoriesHeader'
import { CategoriesList } from '@pages/CatalogCategories/components/CategoriesList/CategoriesList'
import { DeleteCategoryDialog } from '@pages/CatalogCategories/components/DeleteCategoryDialog/DeleteCategoryDialog'
import { EditCategoryDialog } from '@pages/CatalogCategories/components/EditCategoryDialog/EditCategoryDialog'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import { CategoriesHeaderSkeleton } from '@pages/CatalogCategories/skeletons/CategoriesHeaderSkeleton/CategoriesHeaderSkeleton'
import { CategoryRowsSkeleton } from '@pages/CatalogCategories/skeletons/CategoryRowsSkeleton/CategoryRowsSkeleton'

import styles from './CatalogCategories.module.css'

export const CatalogCategories = () => {
  const { categories, isPending, isError } = useCatalogCategoriesFacade()

  if (isPending) {
    return (
      <Box className={styles.catalogCategoriesPage}>
        <Box className={styles.headerRegion}>
          <CategoriesHeaderSkeleton />
        </Box>
        <Box className={styles.feedback}>
          <CategoryRowsSkeleton />
        </Box>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box className={styles.catalogCategoriesPage}>
        <Box className={styles.headerRegion}>
          <Alert variant="error">
            Não foi possível carregar as categorias. Recarregue a página.
          </Alert>
        </Box>
      </Box>
    )
  }

  return (
    <Box className={styles.catalogCategoriesPage}>
      <Box className={styles.headerRegion}>
        <CategoriesHeader />
      </Box>

      {categories.length === 0 ? (
        <Box className={styles.feedback}>
          <CategoriesEmptyState />
        </Box>
      ) : (
        <CategoriesList />
      )}

      <DeleteCategoryDialog />
      <EditCategoryDialog />
    </Box>
  )
}
