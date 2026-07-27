import { useState } from 'react'

import { Stepper } from '@nino/ds/components/Stepper'
import type { SignupAccount } from '@custom_types/auth'

import type { RegisterStep } from './RegisterWizard.types'

import { AccountStep } from './AccountStep'
import { CompanyStep } from './CompanyStep'
import { StoreStep } from './StoreStep'

import styles from '@layouts/AuthLayout/authForm.module.css'

const STEPS = [{ title: 'Conta' }, { title: 'Empresa' }, { title: 'Loja' }]

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

  /* Só voltar, e só do passo 2: a partir do 3 a conta já existe e a sessão
   * está de pé — clicar numa etapa anterior não desfaz isso. */
  const handleStepChange = (next: number) => {
    if (step === 2 && next === 0) handleBack()
  }

  const content =
    step === 1 || !account ? (
      <AccountStep defaultValues={account} onNext={handleAccountNext} />
    ) : step === 2 ? (
      <CompanyStep
        account={account}
        onBack={handleBack}
        onSignedUp={handleSignedUp}
      />
    ) : (
      <StoreStep firstName={account.name.split(' ')[0]} />
    )

  return (
    <>
      <Stepper
        steps={STEPS}
        step={account ? step - 1 : 0}
        onStepChange={handleStepChange}
        className={styles.stepper}
      />
      {content}
    </>
  )
}
