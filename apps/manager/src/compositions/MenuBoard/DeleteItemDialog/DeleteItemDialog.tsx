import { Dialog } from '@nino/ds/components/Dialog'
import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'
import type { MenuItem } from '@custom_types/product/menu-item'
export type DeleteItemDialogProps = {
  tenantId: string | null
  item: MenuItem
  onClose: () => void
}

/**
 * Separate component on purpose: the delete hook is tied to a single item,
 * and mounting the dialog only when there's a target is what keeps the id
 * fixed instead of shifting underneath the mutation.
 */
export const DeleteItemDialog = ({
  tenantId,
  item,
  onClose,
}: DeleteItemDialogProps) => {
  const { mutateAsync: deleteItem, isPending } = useDeleteMenuItem(
    tenantId,
    item.id
  )
  const description =
    `"${item.name}" será removido do cardápio. Esta ` +
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
      open
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
