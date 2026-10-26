import { useNavigate } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Dialog } from '@nino/ds/components/Dialog'
import { CATEGORIES_HAS_PRODUCTS_HINT } from '@pages/CatalogCategories/constants/catalog-categories.constants'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'

const CONFIRM_DESCRIPTION =
  'A categoria sai do painel e do app. Não dá para desfazer.'

export const DeleteCategoryDialog = () => {
  const navigate = useNavigate()
  const {
    deleteTarget: target,
    isDeleting,
    deleteError,
    confirmDelete,
    closeDelete,
  } = useCatalogCategoriesFacade()

  const hasProducts = !!target && target.count > 0

  return (
    <>
      <Dialog
        open={!!target && hasProducts}
        onOpenChange={(open) => !open && closeDelete()}
        title="Ainda não dá para excluir"
        description={CATEGORIES_HAS_PRODUCTS_HINT}
        confirmLabel="Ver itens no cardápio"
        cancelLabel="Fechar"
        onConfirm={() => void navigate('..', { relative: 'path' })}
        onCancel={closeDelete}
      />

      <Dialog
        open={!!target && !hasProducts}
        onOpenChange={(open) => !open && closeDelete()}
        title={`Excluir "${target?.name ?? ''}"`}
        description={CONFIRM_DESCRIPTION}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={closeDelete}
      />

      {deleteError && <Alert variant="error">{deleteError}</Alert>}
    </>
  )
}
