import { Dialog } from '@nino/ds/components/Dialog'
import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'

import type { DeleteItemDialogProps } from './MenuBoard.types'

/**
 * Componente separado de propósito: o hook de exclusão nasce amarrado a um
 * item, e montar o diálogo só quando há alvo é o que deixa o id ser fixo em
 * vez de mudar debaixo da mutation.
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

  /* o erro já vira toast pela meta da mutation — aqui só fecha */
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
      description={`"${item.name}" será removido do cardápio. Esta ação não pode ser desfeita.`}
      confirmLabel="Excluir"
      onConfirm={() => void handleConfirm()}
      onCancel={onClose}
      loading={isPending}
    />
  )
}
