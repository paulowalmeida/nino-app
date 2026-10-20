import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { POSITIONS_GHOST_ROWS } from '@pages/Positions/constants/positions.constants'
import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

import { PositionDialog } from '../PositionDialog/PositionDialog'
import { PositionRemoveDialog } from '../PositionRemoveDialog/PositionRemoveDialog'
import { PositionRow } from '../PositionRow/PositionRow'

import motion from '@styles/motion.module.css'
import styles from './PositionsContent.module.css'

export const PositionsContent = () => {
  const { positions, isPending, isError } = usePositionsFacade()
  const [isCreating, setIsCreating] = useState(false)
  const [editing, setEditing] = useState<UnitPosition | null>(null)
  const [removing, setRemoving] = useState<UnitPosition | null>(null)

  if (isPending) {
    return (
      <Box direction="column" gap={3} aria-busy="true">
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

  const closeForm = () => {
    setIsCreating(false)
    setEditing(null)
  }

  return (
    <>
      <Box className={styles.toolbar}>
        <Button
          className={motion.press}
          onClick={() => setIsCreating(true)}
        >
          <Icon name="plus" />
          Novo cargo
        </Button>
      </Box>

      <Box as="ul" className={styles.list}>
        {positions.map((position) => (
          <PositionRow
            key={position.id}
            position={position}
            onEdit={setEditing}
            onRemove={setRemoving}
          />
        ))}
      </Box>

      <PositionDialog
        open={isCreating || !!editing}
        position={editing}
        onOpenChange={(open) => !open && closeForm()}
      />

      {removing && (
        <PositionRemoveDialog
          position={removing}
          onClose={() => setRemoving(null)}
        />
      )}
    </>
  )
}
