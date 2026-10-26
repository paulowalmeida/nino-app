import { useMutation } from '@tanstack/react-query'

import type { OtpCredentials } from '@shared/types/consumer/otp-credentials'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

export const useRequestOtp = () =>
  useMutation({
    mutationFn: (credentials: OtpCredentials) =>
      consumerAuthService.requestOtp(credentials),
  })
