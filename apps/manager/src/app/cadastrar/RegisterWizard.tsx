'use client'

import { useState } from 'react'

import type { CompleteOnboardingRequest } from '@nino/lib'

import { AccountStep } from './AccountStep'
import { CompanyStep } from './CompanyStep'

type Responsible = CompleteOnboardingRequest['responsible']

export function RegisterWizard() {
  const [responsible, setResponsible] = useState<Responsible | null>(null)

  if (!responsible) return <AccountStep onNext={setResponsible} />

  return <CompanyStep responsible={responsible} />
}
