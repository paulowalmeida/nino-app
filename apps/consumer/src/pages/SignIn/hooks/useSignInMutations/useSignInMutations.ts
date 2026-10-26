import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import type { Consumer } from '@custom_types/consumer/consumer'
import type { OtpCredentials } from '@shared/types/consumer/otp-credentials'
import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useRequestPhoneLink } from '@shared/hooks/useRequestPhoneLink/useRequestPhoneLink'
import { useVerifyPhoneLink } from '@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink'
import { useRequestOtp } from '@pages/sign-in/hooks/useRequestOtp/useRequestOtp'
import { useVerifyOtp } from '@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp'
import { resolveProfileName } from '@pages/sign-in/utils/resolveProfileName/resolveProfileName'

type SignInMutationsHandlers = {
  onCodeRequested: () => void
  goToCompleteProfile: (name: string) => void
  onPhoneCodeRequested: () => void
}

/**
 * Onde os jeitos de entrar terminam no mesmo lugar: uma conta com cadastro
 * completo cai direto na loja; uma conta nova ou incompleta cai na tela de
 * completar cadastro. A decisão mora aqui porque as duas coisas que ela
 * precisa — o resultado da mutação e a navegação — são coisas que um Hook
 * coordena, nunca um facade.
 *
 * O Google não passa por aqui como mutação: é redirect (ver
 * `SignInGoogleButton`/`buildGoogleAuthUrl`), então quando ele termina a
 * sessão já chega pronta em `consumer`, sem nenhum clique interno.
 */
export const useSignInMutations = (
  home: string,
  {
    onCodeRequested,
    goToCompleteProfile,
    onPhoneCodeRequested,
  }: SignInMutationsHandlers,
  consumer: Consumer | null
) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const request = useRequestOtp()
  const verify = useVerifyOtp()
  const requestLink = useRequestPhoneLink()
  const verifyLink = useVerifyPhoneLink()
  const completeProfile = useCompleteProfile()
  const returnTo = searchParams.get('returnTo')
  const destination =
    returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : home

  const goHome = useCallback(
    () => void navigate(destination, { replace: true }),
    [destination, navigate]
  )

  const handleLoggedIn = useCallback(
    (consumer: Consumer) => {
      if (consumer.profileCompletedAt) {
        goHome()
        return
      }
      goToCompleteProfile(resolveProfileName(consumer.name))
    },
    [goHome, goToCompleteProfile]
  )

  const handledInitialSession = useRef(false)
  useEffect(() => {
    if (handledInitialSession.current || !consumer) return
    handledInitialSession.current = true
    handleLoggedIn(consumer)
  }, [consumer, handleLoggedIn])

  const requestCode = (credentials: OtpCredentials) =>
    request.mutate(credentials, { onSuccess: onCodeRequested })

  const verifyCode = (credentials: OtpCredentials, code: string) =>
    verify.mutate({ credentials, code }, { onSuccess: handleLoggedIn })

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
    googleFailed: searchParams.get('googleError') === '1',
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
