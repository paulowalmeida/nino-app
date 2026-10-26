import { useNavigate } from 'react-router'

import { useDeleteProduct } from '@pages/ProductDetail/hooks/useDeleteProduct/useDeleteProduct'

export const useProductRemoval = (
  unitId: string | null,
  productId: string | undefined
) => {
  const navigate = useNavigate()
  const { mutateAsync: deleteProduct, isPending: isRemoving } =
    useDeleteProduct(unitId, productId)

  /* WHY: o erro vira toast porque a ficha sai da tela ao excluir e uma
   * mensagem no corpo da página iria embora junto com ela. */
  const removeProduct = async () => {
    try {
      await deleteProduct()
      void navigate('..', { relative: 'path' })
      return true
    } catch {
      return false
    }
  }

  return { removeProduct, isRemoving }
}
