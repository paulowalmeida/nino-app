import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Pagination } from '@nino/ds/components/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import {
  CASH_MOVEMENT_LABEL,
  CASH_MOVEMENTS_PAGE_SIZE,
} from '@pages/Cash/constants/cash.constants'
import { useCashFacade } from '@pages/Cash/facades/useCashFacade/useCashFacade'
import { cashMovementDetail } from '@pages/Cash/utils/cashMovementDetail/cashMovementDetail'
import { brl } from '@shared/utils/money/money'

import styles from './CashMovements.module.css'

const timeLabel = (createdAt: string): string =>
  new Date(createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const CashMovements = () => {
  const { session } = useCashFacade()
  const [requestedPage, setRequestedPage] = useState(1)

  if (!session) return null

  const { movements } = session
  const pageCount = Math.max(
    1,
    Math.ceil(movements.length / CASH_MOVEMENTS_PAGE_SIZE)
  )
  const page = Math.min(requestedPage, pageCount)
  const pageStart = (page - 1) * CASH_MOVEMENTS_PAGE_SIZE
  const visibleMovements = movements.slice(
    pageStart,
    pageStart + CASH_MOVEMENTS_PAGE_SIZE
  )

  if (!movements.length) {
    return (
      <Text size="sm" color="muted">
        Nada entrou nem saiu da gaveta desde a abertura.
      </Text>
    )
  }

  return (
    <Box as="section" direction="column" className={styles.movements}>
      <Box className={styles.tableShell}>
        <Table>
          <colgroup>
            <col className={styles.colTime} />
            <col className={styles.colKind} />
            <col className={styles.colReason} />
            <col className={styles.colAmount} />
          </colgroup>
          <TableHeader>
            <TableRow className={styles.headRow}>
              <TableHead>Hora</TableHead>
              <TableHead>Movimentação</TableHead>
              <TableHead>Detalhe</TableHead>
              <TableHead className={styles.cashMovementsRight}>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleMovements.map((movement) => {
              const isWithdrawal = movement.kind === 'WITHDRAWAL'

              return (
                <TableRow key={movement.id} className={styles.row}>
                  <TableCell className={styles.time}>
                    <time dateTime={movement.createdAt}>
                      {timeLabel(movement.createdAt)}
                    </time>
                  </TableCell>
                  <TableCell className={styles.kind}>
                    {CASH_MOVEMENT_LABEL[movement.kind]}
                  </TableCell>
                  <TableCell className={styles.reason}>
                    {cashMovementDetail(movement)}
                  </TableCell>
                  <TableCell
                    className={`${styles.amount} ${
                      isWithdrawal ? styles.withdrawal : styles.deposit
                    }`}
                  >
                    {isWithdrawal ? '−' : '+'}
                    {brl(movement.amount)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>

      {pageCount > 1 && (
        <Pagination
          className={styles.pagination}
          count={movements.length}
          pageSize={CASH_MOVEMENTS_PAGE_SIZE}
          page={page}
          onPageChange={setRequestedPage}
        />
      )}
    </Box>
  )
}
