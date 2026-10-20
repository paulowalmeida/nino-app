import { useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'
import { PositionRemoveDialog } from '@shared/components/PositionRemoveDialog/PositionRemoveDialog'

import motion from '@styles/motion.module.css'
import styles from './PositionDetailHeader.module.css'

export const PositionDetailHeader = () => {
  const {
    position,
    isCreating,
    duplicatePosition,
    isDuplicating,
    removePosition,
  } = usePositionDetailFacade()
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false)

  const title = position?.name ?? 'Novo cargo'
  const canDuplicate = !!position && !position.isProtected
  const canRemove = !!position && !position.isDefault

  const description = isCreating
    ? 'Escolha o nome, o nível e o que este cargo pode fazer na loja.'
    : position?.isProtected
      ? 'O Dono sempre tem acesso total à loja.'
      : position?.isDefault
        ? 'Cargo padrão da loja.'
        : 'Quem tem este cargo só faz o que estiver marcado abaixo.'

  return (
    <Box direction="column" gap={4} className={styles.header}>
      <Breadcrumb trail={[{ label: 'Cargos', to: '..' }, { label: title }]} />

      <Box className={styles.heading}>
        <Box className={`${motion.deal} ${styles.identity}`}>
          <Header title={title} accent={title} description={description} />
          {position?.isDefault && <Badge variant="info">Padrão</Badge>}
        </Box>

        <Box className={styles.actions}>
          {position?.isDefault && canDuplicate && (
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
