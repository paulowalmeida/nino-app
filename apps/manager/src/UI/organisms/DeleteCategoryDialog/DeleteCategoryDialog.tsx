import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Dialog } from '@nino/ds/components/Dialog'
import type {
  CategoryWithCount,
} from '@custom_types/product/category-with-count'

export const HAS_PRODUCTS_HINT =
  'Essa categoria ainda tem produtos. Mova ou exclua os produtos antes de ' +
  'excluir a categoria.'

const CONFIRM_DESCRIPTION =
  'A categoria sai do painel e do app. Não dá para desfazer.'

type DeleteCategoryDialogProps = {
  category: CategoryWithCount | null
  isPending: boolean
  error: string | null
  onConfirm: () => Promise<void>
  onViewItems: () => void
  onClose: () => void
}

export const DeleteCategoryDialog = ({
  category,
  isPending,
  error,
  onConfirm,
  onViewItems,
  onClose,
}: DeleteCategoryDialogProps) => {
  const [target, setTarget] = useState<CategoryWithCount | null>(null)
  if (category && category !== target) setTarget(category)

  const hasProducts = !!target && target.count > 0

  return (
    <>
      <Dialog
        open={!!category && hasProducts}
        onOpenChange={(open) => !open && onClose()}
        title="Ainda não dá para excluir"
        description={HAS_PRODUCTS_HINT}
        confirmLabel="Ver itens no cardápio"
        cancelLabel="Fechar"
        onConfirm={onViewItems}
        onCancel={onClose}
      />

      <Dialog
        open={!!category && !hasProducts}
        onOpenChange={(open) => !open && onClose()}
        title={`Excluir "${target?.name ?? ''}"`}
        description={CONFIRM_DESCRIPTION}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={isPending}
        onConfirm={() => void onConfirm()}
        onCancel={onClose}
      />

      {error && <Alert variant="error">{error}</Alert>}
    </>
  )
}
