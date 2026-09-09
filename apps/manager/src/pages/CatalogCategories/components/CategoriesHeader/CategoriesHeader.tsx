import { Header } from '@nino/ds/components/Header'
import { CreateCategoryForm } from '@pages/CatalogCategories/components/CategoriesHeader/CreateCategoryForm/CreateCategoryForm'
import { CATEGORIES_DESCRIPTION } from '@pages/CatalogCategories/constants/catalog-categories.constants'
import { BackLink } from '@shared/components/BackLink/BackLink'

import motion from '@styles/motion.module.css'

export const CategoriesHeader = () => {
  return (
    <>
      <Header
        mb={{ mobile: 5, desktop: 8 }}
        mt={2}
        className={motion.deal}
        title="Como o cardápio se organiza"
        accent="organiza"
        description={CATEGORIES_DESCRIPTION}
      />

      <CreateCategoryForm />
    </>
  )
}
