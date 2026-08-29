import { SignInCodeForm } from '@pages/sign-in/components/SignInCodeForm/SignInCodeForm'
import { SignInHeader } from '@pages/sign-in/components/SignInHeader/SignInHeader'
import { SignInIdentifyForm } from '@pages/sign-in/components/SignInIdentifyForm/SignInIdentifyForm'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'
import { Box } from '@nino/ds/components/Box'

import styles from './SignIn.module.css'

export const SignIn = () => {
  const { store, step } = useSignInFacade()

  return (
    <Box
      className={styles.page}
      style={
        store?.primaryColor
          ? ({ '--store-tint': store.primaryColor } as React.CSSProperties)
          : undefined
      }
    >
      <Box className={styles.shell}>
        <SignInHeader />
        {step === 'identify' && <SignInIdentifyForm />}
        {step === 'code' && <SignInCodeForm />}
      </Box>
    </Box>
  )
}
