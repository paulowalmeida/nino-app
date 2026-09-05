import { Dialog } from '@nino/ds/components/Dialog'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

export const ProductReplacementDialog = () => {
  const { isReplacementPending, replaceBag, dismissReplacement } =
    useProductDetailFacade()

  return (
    <Dialog
      open={isReplacementPending}
      onOpenChange={(open) => !open && dismissReplacement()}
      title="Começar uma sacola nova?"
      description="Sua sacola atual é de outra loja. Para adicionar este item, ela precisa ser substituída."
      confirmLabel="Trocar de loja"
      cancelLabel="Manter sacola"
      onConfirm={replaceBag}
      onCancel={dismissReplacement}
    />
  )
}
