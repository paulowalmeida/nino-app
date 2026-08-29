import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'

import type { RegisterStep } from './RegisterStep.type'

export type RegisterWizardState = {
  step: RegisterStep
  account: SignupAccount | null
  company: SignupCompany | null
  goToCompany: (account: SignupAccount) => void
  goToCompanyStep: () => void
  goToTenant: (company: SignupCompany) => void
  goToAccount: () => void
  reset: () => void
}
