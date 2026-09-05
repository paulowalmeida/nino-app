import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'

export const useVerifyPhoneLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { phone: string; code: string }) =>
      customerAuthService.verifyPhoneLink(data),
    onSuccess: (customer: Customer) => {
      queryClient.setQueryData(queryKeys.session.all, customer)
    },
  })
}
