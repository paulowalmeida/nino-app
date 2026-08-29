import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { addressService } from '@pages/Account/services/address/address.service'

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => addressService.deleteMine(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.myAddresses.all }),
  })
}
