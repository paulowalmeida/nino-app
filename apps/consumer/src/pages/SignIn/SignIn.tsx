import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'

import { SignInBrandStage } from '@pages/sign-in/components/SignInBrandStage/SignInBrandStage'
import { SignInCodeForm } from '@pages/sign-in/components/SignInCodeForm/SignInCodeForm'
import { SignInCompletePhoneCode } from '@pages/sign-in/components/SignInCompletePhoneCode/SignInCompletePhoneCode'
import { SignInCompleteProfile } from '@pages/sign-in/components/SignInCompleteProfile/SignInCompleteProfile'
import { SignInIdentifyForm } from '@pages/sign-in/components/SignInIdentifyForm/SignInIdentifyForm'
import { SignInMethods } from '@pages/sign-in/components/SignInMethods/SignInMethods'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'
import { Box } from '@nino/ds/components/Box'

import styles from './SignIn.module.css'

export const SignIn = () => {
  const { state } = useLocation()
  const { store, step, reset, setChannel, setPhone, goToIdentify } =
    useSignInFacade()

  useLayoutEffect(() => {
    reset()
    const phone = (state as { phone?: unknown } | null)?.phone
    if (typeof phone !== 'string' || !phone) return

    setChannel('phone')
    setPhone(phone)
    goToIdentify()
  }, [goToIdentify, reset, setChannel, setPhone, state])

  return (
    <Box
      className={styles.signInPage}
      style={
        store?.primaryColor
          ? ({ '--store-tint': store.primaryColor } as React.CSSProperties)
          : undefined
      }
    >
      <SignInBrandStage />

      <Box className={styles.signInContent}>
        <Box className={styles.signInShell}>
          {step === 'method' && <SignInMethods />}
          {step === 'identify' && <SignInIdentifyForm />}
          {step === 'code' && <SignInCodeForm />}
          {step === 'complete-profile' && <SignInCompleteProfile />}
          {step === 'complete-phone-code' && <SignInCompletePhoneCode />}
        </Box>
      </Box>
    </Box>
  )
}
