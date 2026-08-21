import { useState } from 'react'

import { Dialog } from '@nino/ds/components/Dialog'

export type DeleteItemsDialogProps = {
  itemIds: string[]
  isPending: boolean
  onConfirm: () => Promise<void>
  onClose: () => void
}

export const DeleteItemsDialog = ({
  itemIds,
  isPending,
  onConfirm,
  onClose,
}: DeleteItemsDialogProps) => {
  const [target, setTarget] = useState(itemIds)
  if (itemIds.length > 0 && itemIds !== target) setTarget(itemIds)

  const count = target.length
  const description =
    (count === 1
      ? '1 item será removido do cardápio.'
      : `${count} itens serão removidos do cardápio.`) +
    ' Esta ação não pode ser desfeita.'

  return (
    <Dialog
      open={itemIds.length > 0}
      onOpenChange={(open) => !open && onClose()}
      title={count === 1 ? 'Excluir item' : 'Excluir itens'}
      description={description}
      confirmLabel="Excluir"
      onConfirm={() => void onConfirm()}
      onCancel={onClose}
      loading={isPending}
    />
  )
}
