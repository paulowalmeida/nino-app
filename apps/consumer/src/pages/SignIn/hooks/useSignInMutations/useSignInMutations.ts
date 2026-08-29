import { useNavigate } from 'react-router'

import type { OtpCredentials } from '@shared/types/customer/otp-credentials'
import { useRequestOtp } from '@pages/sign-in/hooks/useRequestOtp/useRequestOtp'
import { useVerifyOtp } from '@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp'

export const useSignInMutations = (
  home: string,
  onCodeRequested: () => void
) => {
  const navigate = useNavigate()
  const request = useRequestOtp()
  const verify = useVerifyOtp()

  const requestCode = (credentials: OtpCredentials) =>
    request.mutate(credentials, { onSuccess: onCodeRequested })

  const verifyCode = (credentials: OtpCredentials, code: string) =>
    verify.mutate(
      { credentials, code },
      { onSuccess: () => void navigate(home, { replace: true }) }
    )

  return {
    requestCode,
    isRequesting: request.isPending,
    requestFailed: request.isError,
    verifyCode,
    isVerifying: verify.isPending,
    verifyFailed: verify.isError,
  }
}
