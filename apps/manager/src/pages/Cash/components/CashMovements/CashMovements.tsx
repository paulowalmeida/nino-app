import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { CASH_MOVEMENT_LABEL } from '@pages/Cash/constants/cash.constants'
import type { CashMovement } from '@shared/types/cash/cash-movement'
import { brl } from '@shared/utils/money/money'

import styles from './CashMovements.module.css'

export type CashMovementsProps = {
  movements: CashMovement[]
}

const timeLabel = (createdAt: string): string =>
  new Date(createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const CashMovements = ({ movements }: CashMovementsProps) => (
  <Box as="section" direction="column" className={styles.movements}>
    <Box
      direction="row"
      justify="between"
      align="baseline"
      className={styles.head}
    >
      <Heading
        level={2}
        size="sm"
        color="faint"
        className={styles.cashMovementsTitle}
      >
        Movimentações
      </Heading>
      <Text size="xs" color="faint">
        {movements.length} {movements.length === 1 ? 'registro' : 'registros'}
      </Text>
    </Box>

    {!movements.length ? (
      <Text size="sm" color="muted" className={styles.cashMovementsEmpty}>
        Nada entrou nem saiu da gaveta desde a abertura.
      </Text>
    ) : (
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
            {movements.map((movement) => {
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
                    {movement.reason || '—'}
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
    )}
  </Box>
)
