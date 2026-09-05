import { useNavigate } from 'react-router'

import {
  toReplaceProductModifiersRequest,
  toUpdateMenuItemRequest,
} from '@pages/ProductDetail/adapters/product-detail-form.adapter/product-detail-form.adapter'
import { useReplaceProductModifiers } from '@pages/ProductDetail/hooks/useReplaceProductModifiers/useReplaceProductModifiers'
import { useUpdateProduct } from '@pages/ProductDetail/hooks/useUpdateProduct/useUpdateProduct'
import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

export const useProductDetailSubmission = (
  tenantId: string | null,
  productId: string | undefined
) => {
  const navigate = useNavigate()
  const { mutateAsync: updateProduct } = useUpdateProduct(tenantId, productId)
  const { mutateAsync: replaceModifiers } = useReplaceProductModifiers(
    tenantId,
    productId
  )

  const submitProduct = async (values: ProductDetailFormValues) => {
    try {
      await updateProduct(toUpdateMenuItemRequest(values))
      await replaceModifiers(toReplaceProductModifiersRequest(values.modifiers))
      void navigate('..', { relative: 'path' })
      return true
    } catch {
      return false
    }
  }

  const cancel = () => void navigate('..', { relative: 'path' })

  return { submitProduct, cancel }
}
