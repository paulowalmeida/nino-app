import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { CategoriesEmptyState } from '@pages/CatalogCategories/components/CategoriesEmptyState/CategoriesEmptyState'
import { CategoriesHeader } from '@pages/CatalogCategories/components/CategoriesHeader/CategoriesHeader'
import { CategoriesList } from '@pages/CatalogCategories/components/CategoriesList/CategoriesList'
import { DeleteCategoryDialog } from '@pages/CatalogCategories/components/DeleteCategoryDialog/DeleteCategoryDialog'
import { EditCategoryDialog } from '@pages/CatalogCategories/components/EditCategoryDialog/EditCategoryDialog'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import { CategoryRowsSkeleton } from '@pages/CatalogCategories/skeletons/CategoryRowsSkeleton/CategoryRowsSkeleton'

import styles from './CatalogCategories.module.css'

export const CatalogCategories = () => {
  const { categories, isPending, isError } = useCatalogCategoriesFacade()
  const isEmpty = !isPending && !isError && categories.length === 0

  return (
    <Box className={styles.catalogCategoriesPage}>
      <Box className={styles.headerRegion}>
        <CategoriesHeader />
      </Box>

      {isPending && (
        <Box className={styles.feedback}>
          <CategoryRowsSkeleton />
        </Box>
      )}

      {isError && (
        <Box className={styles.feedback}>
          <Alert variant="error">
            Não foi possível carregar as categorias. Recarregue a página.
          </Alert>
        </Box>
      )}

      {isEmpty && (
        <Box className={styles.feedback}>
          <CategoriesEmptyState />
        </Box>
      )}

      {!isPending && !isError && !isEmpty && <CategoriesList />}

      <DeleteCategoryDialog />
      <EditCategoryDialog />
    </Box>
  )
}
