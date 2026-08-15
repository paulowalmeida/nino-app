import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Dialog } from '@nino/ds/components/Dialog'
import type {
  CategoryWithCount,
} from '@custom_types/product/category-with-count'
import { useDeleteCategory } from '@hooks/product/useDeleteCategory'
import { ApiError } from '@nino/lib/utils/api-error'

export const HAS_PRODUCTS_HINT =
  'Essa categoria ainda tem produtos. Mova ou exclua os produtos antes de ' +
  'excluir a categoria.'

const GENERIC_DELETE_ERROR = 'Não foi possível excluir. Tente de novo.'
const CONFIRM_DESCRIPTION =
  'A categoria sai do painel e do app. Não dá para desfazer.'

type DeleteCategoryDialogProps = {
  tenantId: string | null
  category: CategoryWithCount | null
  onClose: () => void
  /* A mutation é interna a este componente — quem monta reage ao
     progresso por aqui, em vez de duplicar `useDeleteCategory` por fora
     (uma segunda instância nunca veria o estado desta). */
  onPendingChange?: (pending: boolean) => void
}

/**
 * Dois diálogos, um alvo: se a categoria tem produtos, mostra o aviso
 * de bloqueio; senão, o de confirmação. Nasce fechada nas duas — quem
 * manda é `category`, e o `target` congelado segura o nome durante a
 * saída, mesmo
 * padrão do `DeleteItemDialog`.
 */
export const DeleteCategoryDialog = ({
  tenantId,
  category,
  onClose,
  onPendingChange,
}: DeleteCategoryDialogProps) => {
  const navigate = useNavigate()
  const { mutateAsync: remove, isPending } = useDeleteCategory(tenantId)

  useEffect(() => {
    onPendingChange?.(isPending)
  }, [isPending, onPendingChange])

  const [target, setTarget] = useState<CategoryWithCount | null>(null)
  if (category && category !== target) setTarget(category)

  const [error, setError] = useState<string | null>(null)

  const hasProducts = !!target && target.count > 0

  const handleConfirm = async () => {
    if (!target) return
    try {
      await remove(target.id)
      onClose()
    } catch (caught) {
      const blocked = caught instanceof ApiError && caught.status === 400
      setError(blocked ? HAS_PRODUCTS_HINT : GENERIC_DELETE_ERROR)
    }
  }

  return (
    <>
      <Dialog
        open={!!category && hasProducts}
        onOpenChange={(open) => !open && onClose()}
        title="Ainda não dá para excluir"
        description={HAS_PRODUCTS_HINT}
        confirmLabel="Ver itens no cardápio"
        cancelLabel="Fechar"
        onConfirm={() => void navigate('..', { relative: 'path' })}
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
        onConfirm={() => void handleConfirm()}
        onCancel={onClose}
      />

      {error && <Alert variant="error">{error}</Alert>}
    </>
  )
}
