import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Consumer } from '@custom_types/consumer/consumer'
import type { OtpCredentials } from '@shared/types/consumer/otp-credentials'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'
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
    }) => consumerAuthService.verifyOtp(credentials, code),
    onSuccess: (consumer: Consumer) => {
      rememberSession()
      queryClient.setQueryData(queryKeys.session.all, consumer)
    },
  })
}
