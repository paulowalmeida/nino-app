"use client"

import { useState } from "react"

import { AccountStep } from "../AccountStep"
import { CompanyStep } from "../CompanyStep"
import type { Account } from "./RegisterWizard.types"

export function RegisterWizard() {
  const [account, setAccount] = useState<Account | null>(null)

  if (!account) return <AccountStep onNext={setAccount} />

  return <CompanyStep account={account} />
}
