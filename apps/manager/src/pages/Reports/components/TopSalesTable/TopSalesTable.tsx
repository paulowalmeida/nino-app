import { Box } from '@nino/ds/components/Box'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import type { TopProduct } from '@shared/types/order/top-product'
import { brl } from '@shared/utils/money/money'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './TopSalesTable.module.css'

/** Pódio: as três primeiras linhas leem antes das outras. */
const podiumClass = (index: number): string => {
  if (index === 0) return `${styles.podium} ${styles.leader}`
  return index < 3 ? styles.podium : ''
}

const tableHead = (
  <TableHeader>
    <TableRow>
      <TableHead className={styles.colRank}>#</TableHead>
      <TableHead>Produto</TableHead>
      <TableHead className={styles.colNumber}>Qtd.</TableHead>
      <TableHead className={styles.colNumber}>Preço un.</TableHead>
      <TableHead className={styles.colNumber}>Total</TableHead>
    </TableRow>
  </TableHeader>
)

export type TopSalesTableProps = {
  products: TopProduct[]
  delay?: number
}

export const TopSalesTable = ({ products, delay = 0 }: TopSalesTableProps) => (
  <Box
    as="section"
    id="mais-vendidos"
    className={`${motion.settle} ${styles.topSalesTableTop}`}
    style={riseDelay(delay)}
    aria-label="Produtos mais vendidos"
  >
    <h2 className={styles.topTitle}>Mais vendidos</h2>

    <Box className={styles.tableWrap}>
      <Table>
        {tableHead}
        <TableBody>
          {products.map((item, index) => (
            <TableRow
              key={item.productId}
              className={`${motion.deal} ${podiumClass(index)}`}
              style={riseDelay(delay + index * 40 + 80)}
            >
              <TableCell className={styles.colRank}>
                <Text className={styles.position}>{index + 1}</Text>
              </TableCell>
              <TableCell className={styles.rankName}>{item.name}</TableCell>
              <TableCell className={styles.colNumber}>
                {item.quantity} un
              </TableCell>
              <TableCell className={styles.colNumber}>
                {brl(item.unitPrice)}
              </TableCell>
              <TableCell className={styles.colTotal}>
                {brl(item.revenue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </Box>
)
