import { useRef } from 'react'

import { Reorder } from 'framer-motion'

import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
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
  const latestOrder = useRef(order)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Reordenar</span>
          </TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <Reorder.Group
        as="tbody"
        axis="y"
        values={order}
        onReorder={(nextOrder) => {
          latestOrder.current = nextOrder
          setOrder(nextOrder)
        }}
        onDragEnd={() => persistOrder(latestOrder.current)}
        className={styles.body}
      >
        {order.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            index={index}
            disabled={isDeleting}
            onEdit={() => requestEdit(category)}
            onDelete={() => requestDelete(category)}
          />
        ))}
      </Reorder.Group>
    </Table>
  )
}
