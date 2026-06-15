"use client"

import { useState } from "react"

import { AccountStep } from "../AccountStep"
import { CompanyStep } from "../CompanyStep"
import type { Account } from "./RegisterWizard.types"

export function RegisterWizard() {
  const [account, setAccount] = useState<Account | null>(null)
  const [step, setStep] = useState(1)

  function handleAccountNext(data: Account) {
    setAccount(data)
    setStep(2)
  }

  if (step === 1 || !account) {
    return <AccountStep defaultValues={account} onNext={handleAccountNext} />
  }

  return <CompanyStep account={account} onBack={() => setStep(1)} />
}
