import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { CATEGORIES_GHOST_ROWS } from '@pages/CatalogCategories/constants/catalog-categories.constants'

import styles from './CategoryRowsSkeleton.module.css'
import categoriesListStyles from '@pages/CatalogCategories/components/CategoriesList/CategoriesList.module.css'
import categoryRowStyles from '@pages/CatalogCategories/components/CategoriesList/CategoryRow/CategoryRow.module.css'

export const CategoryRowsSkeleton = () => (
  <Box className={categoriesListStyles.categoriesList} aria-hidden="true">
    <Table>
      <TableHeader>
        <TableRow className={categoriesListStyles.headRow}>
          <TableHead className={categoriesListStyles.dragHead}>
            <Skeleton className={styles.ghostHeaderHandle} />
          </TableHead>
          <TableHead>
            <Skeleton className={styles.ghostHeaderName} />
          </TableHead>
          <TableHead className={categoriesListStyles.actionsHead}>
            <Skeleton className={styles.ghostHeaderHandle} />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {CATEGORIES_GHOST_ROWS.map((row) => (
          <TableRow key={row} className={styles.categoryRowsSkeletonRow}>
            <TableCell className={categoryRowStyles.dragCell}>
              <Skeleton className={styles.ghostHandle} />
            </TableCell>
            <TableCell className={categoryRowStyles.who}>
              <Skeleton className={styles.ghostName} />
              <Skeleton className={styles.ghostHint} />
            </TableCell>
            <TableCell className={categoryRowStyles.actionsCell}>
              <Box
                direction="row"
                gap={1}
                className={categoryRowStyles.desktopActions}
              >
                <Skeleton className={styles.ghostAction} />
                <Skeleton className={styles.ghostAction} />
              </Box>
              <Skeleton
                className={`${styles.ghostAction} ${categoryRowStyles.compactActions}`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
)
