'use client'

import { useState } from 'react'

import { AccountStep } from '../AccountStep'
import { CompanyStep } from '../CompanyStep'
import type { Responsible } from './RegisterWizard.types'

export function RegisterWizard() {
  const [responsible, setResponsible] = useState<Responsible | null>(null)

  if (!responsible) return <AccountStep onNext={setResponsible} />

  return <CompanyStep responsible={responsible} />
}
