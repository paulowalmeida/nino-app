import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import type { CashMovementKind } from '@shared/types/cash/cash-movement-kind'

import { CashCloseModal } from './CashCloseModal/CashCloseModal'
import { CashMovementModal } from './CashMovementModal/CashMovementModal'

import styles from './CashActions.module.css'

export type CashActionsProps = {
  expectedAmount: number
}

type MovementKind = Exclude<CashMovementKind, 'SALE'>

export const CashActions = ({ expectedAmount }: CashActionsProps) => {
  const [movementKind, setMovementKind] = useState<MovementKind | null>(null)
  const [isClosingOpen, setClosingOpen] = useState(false)

  return (
    <Box as="section" direction="row" wrap className={styles.cashActions}>
      <Button variant="outline" onClick={() => setMovementKind('WITHDRAWAL')}>
        Sangria
      </Button>
      <Button variant="outline" onClick={() => setMovementKind('DEPOSIT')}>
        Suprimento
      </Button>
      <Button onClick={() => setClosingOpen(true)}>Fechar caixa</Button>

      <CashMovementModal
        open={!!movementKind}
        kind={movementKind ?? 'WITHDRAWAL'}
        onClose={() => setMovementKind(null)}
      />
      <CashCloseModal
        open={isClosingOpen}
        expectedAmount={expectedAmount}
        onClose={() => setClosingOpen(false)}
      />
    </Box>
  )
}
