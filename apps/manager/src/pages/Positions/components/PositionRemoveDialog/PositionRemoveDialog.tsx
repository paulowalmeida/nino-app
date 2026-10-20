import { Dialog } from '@nino/ds/components/Dialog'
import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

type PositionRemoveDialogProps = {
  position: UnitPosition
  onClose: () => void
}

export const PositionRemoveDialog = ({
  position,
  onClose,
}: PositionRemoveDialogProps) => {
  const { removePosition } = usePositionsFacade()

  const description =
    `"${position.name}" deixa de existir na loja. ` +
    'Só é possível remover um cargo sem ninguém nele.'

  return (
    <Dialog
      open
      onOpenChange={onClose}
      title="Remover cargo"
      description={description}
      confirmLabel="Remover"
      onConfirm={() => {
        void removePosition(position.id).finally(onClose)
      }}
      onCancel={onClose}
    />
  )
}
