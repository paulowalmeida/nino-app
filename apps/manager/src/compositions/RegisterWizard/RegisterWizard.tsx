import { useState } from 'react'

import type { SignupAccount } from '@custom_types/auth'

import type { RegisterStep } from './RegisterWizard.types'

import { AccountStep } from './AccountStep'
import { CompanyStep } from './CompanyStep'
import { StoreStep } from './StoreStep'

/**
 * Step 1 lives only in memory: account and company go up together in
 * `POST /auth/signup`, which creates both atomically — no orphan account. Step
 * 3 runs already authenticated, so the store is created with a live session
 * instead of on a separate screen the merchant gets redirected to.
 */
export const RegisterWizard = () => {
  const [account, setAccount] = useState<SignupAccount | null>(null)
  const [step, setStep] = useState<RegisterStep>(1)

  const handleAccountNext = (data: SignupAccount) => {
    setAccount(data)
    setStep(2)
  }

  const handleBack = () => setStep(1)

  const handleSignedUp = () => setStep(3)

  if (step === 1 || !account) {
    return <AccountStep defaultValues={account} onNext={handleAccountNext} />
  }

  if (step === 2) {
    return (
      <CompanyStep
        account={account}
        onBack={handleBack}
        onSignedUp={handleSignedUp}
      />
    )
  }

  return <StoreStep firstName={account.name.split(' ')[0]} />
}
