import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import type { OtpCredentials } from '@shared/types/customer/otp-credentials'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'
import { rememberSession } from '@utils/session-hint'

export const useVerifyOtp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      credentials,
      code,
    }: {
      credentials: OtpCredentials
      code: string
    }) => customerAuthService.verifyOtp(credentials, code),
    onSuccess: (customer: Customer) => {
      rememberSession()
      queryClient.setQueryData(queryKeys.session.all, customer)
    },
  })
}
