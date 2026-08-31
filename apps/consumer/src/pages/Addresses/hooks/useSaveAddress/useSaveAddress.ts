import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import type { Address } from '@custom_types/address/address'
import { addressSaveRequest } from '@pages/Addresses/adapters/addressSaveRequest.adapter/addressSaveRequest.adapter'
import { addressService } from '@shared/services/address/address.service'

type SaveAddress = { id?: string; data: SaveAddressRequest }

// WHY: um hook só para criar e editar — a diferença é só ter `id` ou não, e
// o formulário é o mesmo dos dois lados.
export const useSaveAddress = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: SaveAddress) =>
      id
        ? addressService.updateMine(id, data)
        : addressService.createMine(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.myAddresses.all }),
  })

  return {
    ...mutation,
    makePrimary: (address: Address) =>
      mutation.mutate({
        id: address.id,
        data: { ...addressSaveRequest(address), isPrimary: true },
      }),
  }
}
