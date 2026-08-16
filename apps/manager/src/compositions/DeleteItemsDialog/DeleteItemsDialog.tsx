import { useState } from 'react'

import { Dialog } from '@nino/ds/components/Dialog'
import { useDeleteMenuItems } from '@hooks/product/useDeleteMenuItems'

export type DeleteItemsDialogProps = {
  tenantId: string | null
  itemIds: string[]
  onClose: () => void
}

/**
 * Mirrors `DeleteItemDialog`: stays mounted, closes through `open`. Holding
 * the last non-empty selection keeps the count stable while the exit
 * animation plays, after `onClose` has already emptied `itemIds`.
 */
export const DeleteItemsDialog = ({
  tenantId,
  itemIds,
  onClose,
}: DeleteItemsDialogProps) => {
  const [target, setTarget] = useState(itemIds)
  if (itemIds.length > 0 && itemIds !== target) setTarget(itemIds)

  const { mutateAsync: deleteItems, isPending } = useDeleteMenuItems(tenantId)
  const count = target.length
  const description =
    (count === 1
      ? '1 item será removido do cardápio.'
      : `${count} itens serão removidos do cardápio.`) +
    ' Esta ação não pode ser desfeita.'

  const handleConfirm = async () => {
    try {
      await deleteItems(target)
    } finally {
      onClose()
    }
  }

  return (
    <Dialog
      open={itemIds.length > 0}
      onOpenChange={(open) => !open && onClose()}
      title={count === 1 ? 'Excluir item' : 'Excluir itens'}
      description={description}
      confirmLabel="Excluir"
      onConfirm={() => void handleConfirm()}
      onCancel={onClose}
      loading={isPending}
    />
  )
}
