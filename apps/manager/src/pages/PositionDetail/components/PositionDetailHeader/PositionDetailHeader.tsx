import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'
import { PositionRemoveDialog } from '@shared/components/PositionRemoveDialog/PositionRemoveDialog'

import { PositionNameEditor } from '../PositionNameEditor/PositionNameEditor'

import motion from '@styles/motion.module.css'
import styles from './PositionDetailHeader.module.css'

export const PositionDetailHeader = () => {
  const {
    position,
    duplicatePosition,
    isDuplicating,
    removePosition,
  } = usePositionDetailFacade()
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false)

  const title = position?.name ?? 'Novo cargo'
  const canDuplicate = !!position?.isDefault && !position.isProtected
  const canRemove = !!position && !position.isDefault

  return (
    <Box direction="column" gap={4} className={styles.header}>
      <Breadcrumb trail={[{ label: 'Cargos', to: '..' }, { label: title }]} />

      <Box className={styles.heading}>
        <Box className={`${motion.deal} ${styles.identity}`}>
          {position && !position.isDefault ? (
            <PositionNameEditor name={position.name} />
          ) : (
            <Heading level={1} accent size="xl">
              {title}
            </Heading>
          )}
        </Box>

        <Box className={styles.actions}>
          {canDuplicate && (
            <Button
              variant="secondary"
              loading={isDuplicating}
              onClick={() => void duplicatePosition()}
            >
              Duplicar para personalizar
            </Button>
          )}
          {canRemove && (
            <Button
              variant="ghost"
              onClick={() => setIsConfirmingRemoval(true)}
            >
              Remover cargo
            </Button>
          )}
        </Box>
      </Box>

      {isConfirmingRemoval && position && (
        <PositionRemoveDialog
          position={position}
          onConfirm={removePosition}
          onClose={() => setIsConfirmingRemoval(false)}
        />
      )}
    </Box>
  )
}
