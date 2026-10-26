import { Dialog } from '@nino/ds/components/Dialog'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

type PositionRemoveDialogProps = {
  position: UnitPosition
  onConfirm: () => Promise<unknown>
  onClose: () => void
}

export const PositionRemoveDialog = ({
  position,
  onConfirm,
  onClose,
}: PositionRemoveDialogProps) => {
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
        void onConfirm().finally(onClose)
      }}
      onCancel={onClose}
    />
  )
}
