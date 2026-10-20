import { useRef } from 'react'

import { Reorder } from 'framer-motion'

import { Box } from '@nino/ds/components/Box'
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
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
    <Box className={styles.categoriesList}>
      <Table>
        <TableHeader>
          <TableRow className={styles.headRow}>
            <TableHead className={styles.dragHead}>
              <Text as="span" className="sr-only">
                Reordenar
              </Text>
            </TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className={styles.actionsHead}>
              <Text as="span" className="sr-only">
                Ações
              </Text>
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
          className={styles.categoriesListBody}
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
    </Box>
  )
}
