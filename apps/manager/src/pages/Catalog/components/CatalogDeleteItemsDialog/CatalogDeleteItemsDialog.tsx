import { Dialog } from '@nino/ds/components/Dialog'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

export const CatalogDeleteItemsDialog = () => {
  const {
    idsPendingDelete: itemIds,
    isDeletingItems: isPending,
    closeDeleteItems: close,
    deleteItems: remove,
  } = useCatalogFacade()

  const count = itemIds.length
  const description =
    (count === 1
      ? '1 item será removido do cardápio.'
      : `${count} itens serão removidos do cardápio.`) +
    ' Esta ação não pode ser desfeita.'

  return (
    <Dialog
      open={itemIds.length > 0}
      onOpenChange={(open) => !open && close()}
      title={count === 1 ? 'Excluir item' : 'Excluir itens'}
      description={description}
      confirmLabel="Excluir"
      onConfirm={() => void remove(itemIds).finally(close)}
      onCancel={close}
      loading={isPending}
    />
  )
}
