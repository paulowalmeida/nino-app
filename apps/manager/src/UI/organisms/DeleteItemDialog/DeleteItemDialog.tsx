import { useState } from 'react'

import { Dialog } from '@nino/ds/components/Dialog'
import type { MenuItem } from '@custom_types/product/menu-item'

export type DeleteItemDialogProps = {
  item: MenuItem | null
  isPending: boolean
  onConfirm: () => Promise<void>
  onClose: () => void
}

export const DeleteItemDialog = ({
  item,
  isPending,
  onConfirm,
  onClose,
}: DeleteItemDialogProps) => {
  const [target, setTarget] = useState(item)
  if (item && item !== target) setTarget(item)

  const description =
    `"${target?.name ?? ''}" será removido do cardápio. Esta ` +
    'ação não pode ser desfeita.'

  return (
    <Dialog
      open={!!item}
      onOpenChange={(open) => !open && onClose()}
      title="Excluir item"
      description={description}
      confirmLabel="Excluir"
      onConfirm={() => void onConfirm()}
      onCancel={onClose}
      loading={isPending}
    />
  )
}
