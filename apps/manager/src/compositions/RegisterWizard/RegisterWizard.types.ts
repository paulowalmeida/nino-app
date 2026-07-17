import type { SignupAccount } from '@custom_types/auth'

export type RegisterStep = 1 | 2

export type RegisterWizardState = {
  account: SignupAccount | null
  step: RegisterStep
}
