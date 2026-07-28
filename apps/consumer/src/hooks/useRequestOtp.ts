import { useMutation } from '@tanstack/react-query'

import type { OtpCredentials } from '@services/auth/customer-auth.service'
import { requestOtp } from '@services/auth/customer-auth.service'

/** Dispara o código de acesso pelo canal escolhido. */
export const useRequestOtp = () =>
  useMutation({
    mutationFn: (credentials: OtpCredentials) => requestOtp(credentials),
  })
