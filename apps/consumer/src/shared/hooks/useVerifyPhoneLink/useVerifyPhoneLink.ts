import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Consumer } from '@custom_types/consumer/consumer'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

export const useVerifyPhoneLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { phone: string; code: string }) =>
      consumerAuthService.verifyPhoneLink(data),
    onSuccess: (consumer: Consumer) => {
      queryClient.setQueryData(queryKeys.session.all, consumer)
    },
  })
}
