import { useState } from 'react'

import { Dialog } from '@nino/ds/components/Dialog'
import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'
import type { MenuItem } from '@custom_types/product/menu-item'
export type DeleteItemDialogProps = {
  tenantId: string | null
  item: MenuItem | null
  onClose: () => void
}

/**
 * Separate component on purpose: the delete hook is tied to a single item.
 * It stays mounted and closes through `open` — pulling a dialog out of the
 * tree while it is still open skips Ark's exit teardown, which strands
 * `pointer-events: none` on the body and freezes the page. Holding the last
 * item keeps the id from shifting underneath a running mutation and keeps
 * the name on screen through the exit animation.
 */
export const DeleteItemDialog = ({
  tenantId,
  item,
  onClose,
}: DeleteItemDialogProps) => {
  const [target, setTarget] = useState(item)
  if (item && item !== target) setTarget(item)

  const { mutateAsync: deleteItem, isPending } = useDeleteMenuItem(
    tenantId,
    target?.id ?? ''
  )
  const description =
    `"${target?.name ?? ''}" será removido do cardápio. Esta ` +
    'ação não pode ser desfeita.'

  /* the error already becomes a toast via the mutation meta — just closes */
  const handleConfirm = async () => {
    try {
      await deleteItem()
    } finally {
      onClose()
    }
  }

  return (
    <Dialog
      open={!!item}
      onOpenChange={(open) => !open && onClose()}
      title="Excluir item"
      description={description}
      confirmLabel="Excluir"
      onConfirm={() => void handleConfirm()}
      onCancel={onClose}
      loading={isPending}
    />
  )
}
