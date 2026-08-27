import { useNavigate } from 'react-router'

import { toast } from '@nino/ds/components/Toast'
import { toCreateMenuItemRequest } from '@pages/NewProduct/adapters/product-form.adapter/product-form.adapter'
import { useCreateProduct } from '@pages/NewProduct/hooks/useCreateProduct/useCreateProduct'
import type { NewProductFormValues } from '@pages/NewProduct/types/NewProductFormValues.type'

export const useNewProductSubmission = (tenantId: string | null) => {
  const navigate = useNavigate()
  const { mutateAsync: createProduct } = useCreateProduct(tenantId)

  const submitProduct = async (
    values: NewProductFormValues,
    photo: File | null
  ) => {
    try {
      const created = await createProduct({
        data: toCreateMenuItemRequest(values),
        image: photo,
      })

      if (created.imageUploadFailed) {
        toast.warning(
          'Item criado, mas a foto não subiu',
          'Abra o item no cardápio e envie a foto de novo.'
        )
      }

      void navigate('..', { relative: 'path' })
      return true
    } catch {
      return false
    }
  }

  const cancel = () => void navigate('..', { relative: 'path' })

  return { submitProduct, cancel }
}
