import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { deleteMyAddress } from '@services/address.service'

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteMyAddress(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.myAddresses.all }),
  })
}
