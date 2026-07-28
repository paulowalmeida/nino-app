import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import type { UpdateMyProfileRequest } from '@custom_types/customer/update-my-profile-request'
import { updateMyProfile } from '@services/auth/customer-auth.service'

/** Nome, e-mail e CPF do próprio cliente — o resto do cadastro é do servidor. */
export const useCompleteProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateMyProfileRequest) => updateMyProfile(data),
    onSuccess: (customer: Customer) => {
      queryClient.setQueryData(queryKeys.session.all, customer)
    },
  })
}
