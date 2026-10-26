import { Box } from '@nino/ds/components/Box'
import { NewProductForm } from '@pages/NewProduct/components/NewProductForm/NewProductForm'
import { NewProductHeader } from '@pages/NewProduct/components/NewProductHeader/NewProductHeader'
import { useNewProductFacade } from '@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade'
import { NewProductFormSkeleton } from '@pages/NewProduct/skeletons/NewProductFormSkeleton/NewProductFormSkeleton'

import styles from './NewProduct.module.css'

export const NewProduct = () => {
  const { isCategoriesPending } = useNewProductFacade()

  return (
    <Box className={styles.newProductPage}>
      <NewProductHeader />

      {isCategoriesPending ? <NewProductFormSkeleton /> : <NewProductForm />}
    </Box>
  )
}
