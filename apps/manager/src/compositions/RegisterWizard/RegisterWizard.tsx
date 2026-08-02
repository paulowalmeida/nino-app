import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Stepper } from '@nino/ds/components/Stepper'
import type { SignupAccount } from '@custom_types/auth'

import type { RegisterStep } from './RegisterWizard.types'

import { AccountStep } from './AccountStep'
import { CompanyStep } from './CompanyStep'

import styles from '@layouts/AuthLayout/authForm.module.css'

const STEPS = [{ title: 'Conta' }, { title: 'Empresa' }]

/**
 * Cadastro termina na empresa. Conta e empresa sobem juntas em
 * `POST /auth/signup`, que cria as duas de forma atômica — não existe conta
 * órfã. A loja não é etapa de cadastro: ela nasce dentro do gestor, na tela de
 * unidades, onde a segunda, a terceira e a décima também nascem. Uma tela só
 * para a primeira loja seria um caminho que ninguém percorre duas vezes.
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

  /* A sessão já está de pé quando o signup responde: a raiz lê a sessão nova e
   * manda para as unidades, que é onde a loja é criada. */
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
