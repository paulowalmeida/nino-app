import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import type { UpdateMyProfileRequest } from '@custom_types/customer/update-my-profile-request'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'

export const useCompleteProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateMyProfileRequest) =>
      customerAuthService.updateMyProfile(data),
    onSuccess: (customer: Customer) => {
      queryClient.setQueryData(queryKeys.session.all, customer)
    },
  })
}
