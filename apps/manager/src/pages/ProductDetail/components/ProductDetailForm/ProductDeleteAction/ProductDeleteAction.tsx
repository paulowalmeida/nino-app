import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

export const ProductDeleteAction = () => {
  const { item, removeProduct, isRemoving } = useProductDetailFacade()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  if (!item) return null

  const confirmRemoval = async () => {
    const removed = await removeProduct()
    if (!removed) setIsConfirmOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        variant="danger"
        onClick={() => setIsConfirmOpen(true)}
      >
        Excluir item
      </Button>

      <Dialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Excluir item"
        description={`"${item.name}" será removido do cardápio. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={() => void confirmRemoval()}
        onCancel={() => setIsConfirmOpen(false)}
        loading={isRemoving}
      />
    </>
  )
}
