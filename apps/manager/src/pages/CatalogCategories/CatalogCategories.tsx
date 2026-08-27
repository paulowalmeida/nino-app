import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { CategoriesHeader } from '@pages/CatalogCategories/components/CategoriesHeader/CategoriesHeader'
import { CategoriesList } from '@pages/CatalogCategories/components/CategoriesList/CategoriesList'
import { DeleteCategoryDialog } from '@pages/CatalogCategories/components/DeleteCategoryDialog/DeleteCategoryDialog'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import { CategoryRowsSkeleton } from '@pages/CatalogCategories/skeletons/CategoryRowsSkeleton/CategoryRowsSkeleton'

import motion from '@styles/motion.module.css'
import styles from './CatalogCategories.module.css'

export const CatalogCategories = () => {
  const { categories, isPending, isError } = useCatalogCategoriesFacade()
  const isEmpty = !isPending && !isError && categories.length === 0

  return (
    <Box className={styles.page}>
      <CategoriesHeader />

      {isPending && <CategoryRowsSkeleton />}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar as categorias. Recarregue a página.
        </Alert>
      )}

      {isEmpty && (
        <EmptyState className={motion.unroll}>
          Nenhuma categoria ainda. Crie a primeira acima — depois cadastre
          itens dentro dela.
        </EmptyState>
      )}

      {!isPending && !isError && !isEmpty && <CategoriesList />}

      <DeleteCategoryDialog />
    </Box>
  )
}
