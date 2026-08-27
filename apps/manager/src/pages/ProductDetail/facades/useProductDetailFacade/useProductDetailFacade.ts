import { useParams } from 'react-router'

import { useProductDetail } from '@pages/ProductDetail/hooks/useProductDetail/useProductDetail'
import { useProductDetailSubmission } from '@pages/ProductDetail/hooks/useProductDetailSubmission/useProductDetailSubmission'
import { useProductRemoval } from '@pages/ProductDetail/hooks/useProductRemoval/useProductRemoval'
import { useRemoveProductImage } from '@pages/ProductDetail/hooks/useRemoveProductImage/useRemoveProductImage'
import { useUploadProductImage } from '@pages/ProductDetail/hooks/useUploadProductImage/useUploadProductImage'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useProductDetailFacade = () => {
  const { productId } = useParams()
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const detail = useProductDetail(tenantId, productId)
  const submission = useProductDetailSubmission(tenantId, productId)
  const removal = useProductRemoval(tenantId, productId)
  const imageUpload = useUploadProductImage(tenantId, productId)
  const imageRemoval = useRemoveProductImage(tenantId, productId)

  return {
    ...detail,
    ...submission,
    ...removal,
    uploadImage: imageUpload.mutate,
    isUploadingImage: imageUpload.isPending,
    removeImage: imageRemoval.mutate,
    isRemovingImage: imageRemoval.isPending,
  }
}
