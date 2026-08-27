import { Reorder } from 'framer-motion'

import { CategoryRow } from '@pages/CatalogCategories/components/CategoriesList/CategoryRow/CategoryRow'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'

import styles from './CategoriesList.module.css'

export const CategoriesList = () => {
  const {
    order,
    isDeleting,
    isRenaming,
    renamingId,
    setOrder,
    persistOrder,
    rename,
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
          isRenaming={isRenaming && renamingId === category.id}
          disabled={isDeleting}
          onRename={async (name) => {
            await rename({ id: category.id, name })
          }}
          onDelete={() => requestDelete(category)}
          onDragEnd={persistOrder}
        />
      ))}
    </Reorder.Group>
  )
}
