import type { SignupAccount } from '@shared/types/auth/signup-account'

import type { RegisterStep } from './RegisterStep.type'

export type RegisterWizardState = {
  step: RegisterStep
  account: SignupAccount | null
  goToCompany: (account: SignupAccount) => void
  goToAccount: () => void
  reset: () => void
}
