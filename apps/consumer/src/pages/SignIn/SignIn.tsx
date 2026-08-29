import {
  SignInCodeForm,
} from '@pages/sign-in/components/SignInCodeForm/SignInCodeForm'
import {
  SignInHeader,
} from '@pages/sign-in/components/SignInHeader/SignInHeader'
import {
  SignInIdentifyForm,
} from '@pages/sign-in/components/SignInIdentifyForm/SignInIdentifyForm'
import {
  useSignInFacade,
} from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import styles from './SignIn.module.css'

export const SignIn = () => {
  const { store, step } = useSignInFacade()

  return (
    <div
      className={styles.page}
      style={
        store?.primaryColor
          ? ({ '--store-tint': store.primaryColor } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles.shell}>
        <SignInHeader />
        {step === 'identify' && <SignInIdentifyForm />}
        {step === 'code' && <SignInCodeForm />}
      </div>
    </div>
  )
}
