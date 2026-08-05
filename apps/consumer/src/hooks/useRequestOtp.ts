import { useMutation } from '@tanstack/react-query'

import type { OtpCredentials } from '@services/customer-auth.service'
import { requestOtp } from '@services/customer-auth.service'

/** Dispara o código de acesso pelo canal escolhido. */
export const useRequestOtp = () =>
  useMutation({
    mutationFn: (credentials: OtpCredentials) => requestOtp(credentials),
  })
