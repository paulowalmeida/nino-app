import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import {
  createMyAddress,
  updateMyAddress,
} from '@services/address.service'

type SaveAddress = { id?: string; data: SaveAddressRequest }

// WHY: um hook só para criar e editar — a diferença é só ter `id` ou não, e
// o formulário é o mesmo dos dois lados.
export const useSaveAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: SaveAddress) =>
      id ? updateMyAddress(id, data) : createMyAddress(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.myAddresses.all }),
  })
}
