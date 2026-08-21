import { useState } from 'react'

import { Dialog } from '@nino/ds/components/Dialog'
import type { MenuItem } from '@custom_types/product/menu-item'

export type DeleteItemDialogProps = {
  item: MenuItem | null
  isPending: boolean
  onConfirm: () => Promise<void>
  onClose: () => void
}

/**
 * Stays mounted and closes through `open`: removing it while open skips Ark's
 * exit teardown and can leave `pointer-events: none` on the body. Holding the
 * last item preserves its name through that exit animation.
 */
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
