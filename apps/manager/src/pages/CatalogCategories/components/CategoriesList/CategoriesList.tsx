import { Reorder } from 'framer-motion'

import { CategoryRow } from '@pages/CatalogCategories/components/CategoriesList/CategoryRow/CategoryRow'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'

import styles from './CategoriesList.module.css'

export const CategoriesList = () => {
  const {
    order,
    isDeleting,
    setOrder,
    persistOrder,
    requestEdit,
    requestDelete,
  } = useCatalogCategoriesFacade()

  return (
    <Reorder.Group
      as="ul"
      axis="y"
      values={order}
      onReorder={setOrder}
      className={styles.list}
    >
      {order.map((category, index) => (
        <CategoryRow
          key={category.id}
          category={category}
          index={index}
          disabled={isDeleting}
          onEdit={() => requestEdit(category)}
          onDelete={() => requestDelete(category)}
          onDragEnd={persistOrder}
        />
      ))}
    </Reorder.Group>
  )
}
