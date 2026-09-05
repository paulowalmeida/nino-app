import { useNavigate } from 'react-router'

import type { Customer } from '@custom_types/customer/customer'
import type { OtpCredentials } from '@shared/types/customer/otp-credentials'
import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useGoogleSignIn } from '@pages/sign-in/hooks/useGoogleSignIn/useGoogleSignIn'
import { useRequestOtp } from '@pages/sign-in/hooks/useRequestOtp/useRequestOtp'
import { useRequestPhoneLink } from '@pages/sign-in/hooks/useRequestPhoneLink/useRequestPhoneLink'
import { useVerifyOtp } from '@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp'
import { useVerifyPhoneLink } from '@pages/sign-in/hooks/useVerifyPhoneLink/useVerifyPhoneLink'
import { resolveProfileName } from '@pages/sign-in/utils/resolveProfileName/resolveProfileName'

type SignInMutationsHandlers = {
  onCodeRequested: () => void
  goToCompleteProfile: (name: string) => void
  onPhoneCodeRequested: () => void
}

/**
 * Onde os três jeitos de entrar terminam no mesmo lugar: uma conta com
 * cadastro completo cai direto na loja; uma conta nova ou incompleta cai na
 * tela de completar cadastro. A decisão mora aqui porque as duas coisas que
 * ela precisa — o resultado da mutação e a navegação — são coisas que um
 * Hook coordena, nunca um facade.
 */
export const useSignInMutations = (
  home: string,
  {
    onCodeRequested,
    goToCompleteProfile,
    onPhoneCodeRequested,
  }: SignInMutationsHandlers
) => {
  const navigate = useNavigate()
  const request = useRequestOtp()
  const verify = useVerifyOtp()
  const google = useGoogleSignIn()
  const requestLink = useRequestPhoneLink()
  const verifyLink = useVerifyPhoneLink()
  const completeProfile = useCompleteProfile()

  const goHome = () => void navigate(home, { replace: true })

  const handleLoggedIn = (customer: Customer) => {
    if (customer.profileCompletedAt) {
      goHome()
      return
    }
    goToCompleteProfile(resolveProfileName(customer.name))
  }

  const requestCode = (credentials: OtpCredentials) =>
    request.mutate(credentials, { onSuccess: onCodeRequested })

  const verifyCode = (credentials: OtpCredentials, code: string) =>
    verify.mutate({ credentials, code }, { onSuccess: handleLoggedIn })

  const signInWithGoogle = (idToken: string) =>
    google.mutate(idToken, { onSuccess: handleLoggedIn })

  const requestPhoneCode = (phone: string) =>
    requestLink.mutate({ phone }, { onSuccess: onPhoneCodeRequested })

  const verifyPhoneCode = (phone: string, code: string) =>
    verifyLink.mutate({ phone, code }, { onSuccess: goHome })

  /**
   * Fecha o cadastro. O nome sempre é salvo; o telefone é o que decide o
   * próximo passo — sem ele a pessoa já está pronta para a loja, com ele
   * falta confirmar o número antes de ir embora.
   */
  const finishProfile = (name: string, phone: string) =>
    completeProfile.mutate(
      { name },
      {
        onSuccess: () => (phone ? requestPhoneCode(phone) : goHome()),
      }
    )

  return {
    requestCode,
    isRequesting: request.isPending,
    requestFailed: request.isError,
    verifyCode,
    isVerifying: verify.isPending,
    verifyFailed: verify.isError,
    signInWithGoogle,
    isSigningInWithGoogle: google.isPending,
    googleFailed: google.isError,
    requestPhoneCode,
    isRequestingPhoneCode: requestLink.isPending,
    requestPhoneCodeFailed: requestLink.isError,
    verifyPhoneCode,
    isVerifyingPhoneCode: verifyLink.isPending,
    verifyPhoneCodeFailed: verifyLink.isError,
    finishProfile,
    isFinishingProfile: completeProfile.isPending || requestLink.isPending,
    finishProfileFailed: completeProfile.isError,
    skipPhone: goHome,
  }
}
