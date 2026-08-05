import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import type { TopProduct } from '@custom_types/order/top-product'
import { TOP_SALES_TABLE_GHOST_ROWS } from '@constants/order.constants'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './TopSalesTable.module.css'
import motion from '@styles/motion.module.css'

/** Pódio: as três primeiras linhas leem antes das outras. */
const podiumClass = (index: number): string => {
  if (index === 0) return `${styles.podium} ${styles.leader}`
  return index < 3 ? styles.podium : ''
}

/** Um cabeçalho só para os dois estados — carregando e carregado. */
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
  awaitingDates: boolean
  isError: boolean
  isPending: boolean
  noSales: boolean
  products: TopProduct[]
}

export const TopSalesTable = ({
  awaitingDates,
  isError,
  isPending,
  noSales,
  products,
}: TopSalesTableProps) => (
  <section className={styles.top} aria-label="Produtos mais vendidos">
    <h2 className={styles.topTitle}>Mais vendidos</h2>

    {awaitingDates && (
      <EmptyState>
        Escolha as datas de início e fim para ver o relatório.
      </EmptyState>
    )}

    {/* O teto da janela é da API — mostrar o que ela recusou evita duas
        regras de limite vivendo em lugares diferentes. */}
    {isError && (
      <EmptyState title="Não deu para montar o relatório">
        Confira o período escolhido — janelas muito longas não são aceitas.
      </EmptyState>
    )}

    {/* a mesma tabela, com as células por preencher: cabeçalho e larguras
        de coluna já no lugar, para o ranking não se remontar ao chegar */}
    {!awaitingDates && isPending && (
      <div className={styles.tableWrap}>
        <Table>
          {tableHead}
          <TableBody>
            {TOP_SALES_TABLE_GHOST_ROWS.map((row) => (
              <TableRow key={row}>
                <TableCell className={styles.colRank}>
                  <Skeleton className={styles.ghostPosition} />
                </TableCell>
                <TableCell className={styles.rankName}>
                  <Skeleton className={styles.ghostName} />
                </TableCell>
                <TableCell className={styles.colNumber}>
                  <Skeleton className={styles.ghostCell} />
                </TableCell>
                <TableCell className={styles.colNumber}>
                  <Skeleton className={styles.ghostCell} />
                </TableCell>
                <TableCell className={styles.colTotal}>
                  <Skeleton className={styles.ghostCell} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}

    {noSales && <EmptyState>Nenhuma venda concluída no período.</EmptyState>}

    {!awaitingDates && !isPending && !noSales && (
      <div className={styles.tableWrap}>
        <Table>
          {tableHead}
          <TableBody>
            {products.map((item, index) => (
              <TableRow
                key={item.productId}
                className={`${motion.deal} ${podiumClass(index)}`}
                style={riseDelay(index * 40)}
              >
                <TableCell className={styles.colRank}>
                  <span className={styles.position}>{index + 1}</span>
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
      </div>
    )}
  </section>
)
