import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Consumer } from '@custom_types/consumer/consumer'
import type { UpdateMyProfileRequest } from '@custom_types/consumer/update-my-profile-request'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

export const useCompleteProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateMyProfileRequest) =>
      consumerAuthService.updateMyProfile(data),
    onSuccess: (consumer: Consumer) => {
      queryClient.setQueryData(queryKeys.session.all, consumer)
    },
  })
}
