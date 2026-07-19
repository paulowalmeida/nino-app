import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  removeItemImage,
  uploadItemImage,
} from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

export const useItemImages = (tenantId: string | null, productId: string) => {
  const queryClient = useQueryClient()
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })

  const upload = useMutation({
    mutationFn: (file: File) =>
      uploadItemImage(tenantId as string, productId, file),
    onSuccess: () => void refresh(),
  })

  const remove = useMutation({
    mutationFn: (imageId: string) =>
      removeItemImage(tenantId as string, productId, imageId),
    onSuccess: () => void refresh(),
  })

  return { upload, remove }
}
