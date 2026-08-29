import { useMutation } from '@tanstack/react-query'

import type { OtpCredentials } from '@shared/types/customer/otp-credentials'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'

export const useRequestOtp = () =>
  useMutation({
    mutationFn: (credentials: OtpCredentials) =>
      customerAuthService.requestOtp(credentials),
  })
