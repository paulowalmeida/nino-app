import { useLayoutEffect } from 'react'

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
  const { store, step, reset } = useSignInFacade()

  useLayoutEffect(() => {
    reset()
  }, [reset])

  return (
    <Box
      className={styles.page}
      style={
        store?.primaryColor
          ? ({ '--store-tint': store.primaryColor } as React.CSSProperties)
          : undefined
      }
    >
      <SignInBrandStage />

      <Box className={styles.content}>
        <Box className={styles.shell}>
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
