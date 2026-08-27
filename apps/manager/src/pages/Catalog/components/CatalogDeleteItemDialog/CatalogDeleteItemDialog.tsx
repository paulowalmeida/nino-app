import { Dialog } from '@nino/ds/components/Dialog'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

export const CatalogDeleteItemDialog = () => {
  const {
    itemPendingDelete: item,
    isDeletingItem: isPending,
    closeDeleteItem: close,
    deleteItem: remove,
  } = useCatalogFacade()

  const description =
    `"${item?.name ?? ''}" será removido do cardápio. Esta ` +
    'ação não pode ser desfeita.'

  return (
    <Dialog
      open={!!item}
      onOpenChange={(open) => !open && close()}
      title="Excluir item"
      description={description}
      confirmLabel="Excluir"
      onConfirm={() => {
        if (item) void remove(item.id).finally(close)
      }}
      onCancel={close}
      loading={isPending}
    />
  )
}
