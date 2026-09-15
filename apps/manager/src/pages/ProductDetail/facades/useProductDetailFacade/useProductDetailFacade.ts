import { useParams } from 'react-router'

import { useProductDetail } from '@pages/ProductDetail/hooks/useProductDetail/useProductDetail'
import { useProductDetailSubmission } from '@pages/ProductDetail/hooks/useProductDetailSubmission/useProductDetailSubmission'
import { useProductRemoval } from '@pages/ProductDetail/hooks/useProductRemoval/useProductRemoval'
import { useRemoveProductImage } from '@pages/ProductDetail/hooks/useRemoveProductImage/useRemoveProductImage'
import { useUploadProductImage } from '@pages/ProductDetail/hooks/useUploadProductImage/useUploadProductImage'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useProductDetailFacade = () => {
  const { productId } = useParams()
  const unitId = useCurrentUnit()?.unitId ?? null
  const detail = useProductDetail(unitId, productId)
  const submission = useProductDetailSubmission(unitId, productId)
  const removal = useProductRemoval(unitId, productId)
  const imageUpload = useUploadProductImage(unitId, productId)
  const imageRemoval = useRemoveProductImage(unitId, productId)

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
