import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

export const useItemImages = (tenantId: string | null, productId: string) => {
  const queryClient = useQueryClient()
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })

  const upload = useMutation({
    /* O cropper mostra o erro no lugar da foto. */
    meta: { success: 'Foto salva', silentError: true },
    mutationFn: (file: File) =>
      ProductService.uploadItemImage(tenantId as string, productId, file),
    onSuccess: () => void refresh(),
  })

  const remove = useMutation({
    meta: { success: 'Foto removida', errorTitle: 'A foto continua no item' },
    mutationFn: (imageId: string) =>
      ProductService.removeItemImage(tenantId as string, productId, imageId),
    onSuccess: () => void refresh(),
  })

  return { upload, remove }
}
