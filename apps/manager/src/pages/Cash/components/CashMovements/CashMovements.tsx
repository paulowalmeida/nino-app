import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { CASH_MOVEMENT_LABEL } from '@shared/constants/cash.constants'
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
    <Heading level={2} size="md">
      Movimentações
    </Heading>

    {!movements.length && (
      <Text size="sm" color="muted">
        Nada entrou nem saiu da gaveta desde a abertura.
      </Text>
    )}

    {movements.map((movement) => (
      <Box
        key={movement.id}
        direction="row"
        justify="between"
        align="center"
        className={styles.row}
      >
        <Box direction="column" className={styles.what}>
          <Text size="sm" weight="semibold">
            {CASH_MOVEMENT_LABEL[movement.kind]}
          </Text>
          <Text size="xs" color="faint">
            {timeLabel(movement.createdAt)}
            {movement.reason ? ` · ${movement.reason}` : ''}
          </Text>
        </Box>
        <Text
          size="sm"
          weight="bold"
          color={movement.kind === 'WITHDRAWAL' ? 'danger' : 'brand-strong'}
        >
          {movement.kind === 'WITHDRAWAL' ? '−' : '+'}
          {brl(movement.amount)}
        </Text>
      </Box>
    ))}
  </Box>
)
