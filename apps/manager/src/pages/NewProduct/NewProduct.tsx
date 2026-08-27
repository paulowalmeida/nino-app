import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { NewProductForm } from '@pages/NewProduct/components/NewProductForm/NewProductForm'
import { useNewProductFacade } from '@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade'
import { NewProductFormSkeleton } from '@pages/NewProduct/skeletons/NewProductFormSkeleton/NewProductFormSkeleton'
import { BackLink } from '@shared/components/BackLink/BackLink'

import styles from './NewProduct.module.css'

const DESCRIPTION = 'O que o cliente vê no cardápio, tudo em um lugar só.'

export const NewProduct = () => {
  const { isCategoriesPending } = useNewProductFacade()

  return (
    <Box className={styles.page}>
      <BackLink>Cardápio</BackLink>

      <Header
        className={styles.header}
        mb={5}
        title="Novo item"
        accent="item"
        description={DESCRIPTION}
      />

      {isCategoriesPending ? <NewProductFormSkeleton /> : <NewProductForm />}
    </Box>
  )
}
