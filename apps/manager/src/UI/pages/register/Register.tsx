import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Stepper } from '@nino/ds/components/Stepper'
import type { SignupAccount } from '@custom_types/auth/signup-account'
import { AccountStep } from '@organisms/AccountStep/AccountStep'
import { CompanyStep } from '@organisms/CompanyStep/CompanyStep'
import { REGISTER_WIZARD_STEPS } from '@constants/auth.constants'

import styles from '@styles/authForm.module.css'

type RegisterStep = 1 | 2

export const Register = () => {
  const navigate = useNavigate()
  const [account, setAccount] = useState<SignupAccount | null>(null)
  const [step, setStep] = useState<RegisterStep>(1)

  const handleAccountNext = (account: SignupAccount) => {
    setAccount(account)
    setStep(2)
  }

  const handleBack = () => setStep(1)

  const handleSignedUp = () => void navigate('/')

  const handleStepChange = (next: number) => {
    if (step === 2 && next === 0) handleBack()
  }

  return (
    <>
      <Stepper
        steps={REGISTER_WIZARD_STEPS}
        step={step - 1}
        onStepChange={handleStepChange}
        className={styles.stepper}
      />

      {step === 2 && account ? (
        <CompanyStep
          account={account}
          onBack={handleBack}
          onSignedUp={handleSignedUp}
        />
      ) : (
        <AccountStep defaultValues={account} onNext={handleAccountNext} />
      )}
    </>
  )
}
