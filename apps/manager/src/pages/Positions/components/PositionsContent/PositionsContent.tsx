import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'
import { PositionRemoveDialog } from '@shared/components/PositionRemoveDialog/PositionRemoveDialog'
import { POSITIONS_GHOST_ROWS } from '@shared/constants/positions.constants'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

import { PositionsTable } from '../PositionsTable/PositionsTable'

import styles from './PositionsContent.module.css'

export const PositionsContent = () => {
  const { positions, isPending, isError, removePosition } =
    usePositionsFacade()
  const [removing, setRemoving] = useState<UnitPosition | null>(null)

  if (isPending) {
    return (
      <Box
        direction="column"
        gap={3}
        aria-busy="true"
        className={styles.content}
      >
        {POSITIONS_GHOST_ROWS.map((row) => (
          <Skeleton key={row} className={styles.ghostRow} />
        ))}
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert variant="error">
        Não foi possível carregar os cargos. Tente de novo em instantes.
      </Alert>
    )
  }

  return (
    <Box className={styles.content}>
      <PositionsTable positions={positions} onRemove={setRemoving} />

      {removing && (
        <PositionRemoveDialog
          position={removing}
          onConfirm={() => removePosition(removing.id)}
          onClose={() => setRemoving(null)}
        />
      )}
    </Box>
  )
}
