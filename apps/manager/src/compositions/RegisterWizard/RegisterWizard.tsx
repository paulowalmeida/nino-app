import { useState } from 'react'

import type { SignupAccount } from '@custom_types/auth'

import { AccountStep } from './AccountStep'
import { CompanyStep } from './CompanyStep'

/**
 * Step 1 lives only in memory: account and company go up together in
 * `POST /auth/signup`, which creates both atomically — no orphan account.
 */
export const RegisterWizard = () => {
  const [account, setAccount] = useState<SignupAccount | null>(null)
  const [step, setStep] = useState(1)

  const handleAccountNext = (data: SignupAccount) => {
    setAccount(data)
    setStep(2)
  }

  const handleBack = () => setStep(1)

  if (step === 1 || !account) {
    return <AccountStep defaultValues={account} onNext={handleAccountNext} />
  }

  return <CompanyStep account={account} onBack={handleBack} />
}
