import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Stepper } from '@nino/ds/components/Stepper'
import type { SignupAccount } from '@custom_types/auth/signup-account'
import { AccountStep } from './AccountStep/AccountStep'
import { CompanyStep } from './CompanyStep/CompanyStep'

import styles from '@styles/authForm.module.css'

const STEPS = [{ title: 'Conta' }, { title: 'Empresa' }]

type RegisterStep = 1 | 2

/**
 * Signup ends at the company. Account and company go up together in
 * `POST /auth/signup`, which creates both atomically — there is no orphan
 * account. The store is not a signup step: it is born inside the manager,
 * on the units screen, the same place the second, third and tenth store are
 * born too. A dedicated screen for the first store would be a path nobody
 * walks twice.
 */
export const RegisterWizard = () => {
  const navigate = useNavigate()
  const [account, setAccount] = useState<SignupAccount | null>(null)
  const [step, setStep] = useState<RegisterStep>(1)

  const handleAccountNext = (data: SignupAccount) => {
    setAccount(data)
    setStep(2)
  }

  const handleBack = () => setStep(1)

  /* The session is already up by the time signup responds: the root reads
   * the new session and sends the person to units, which is where the
   * store gets created. */
  const handleSignedUp = () => void navigate('/')

  const handleStepChange = (next: number) => {
    if (step === 2 && next === 0) handleBack()
  }

  return (
    <>
      <Stepper
        steps={STEPS}
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
