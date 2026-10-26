import type { SetRegisterWizardState } from '@pages/Register/types/SetRegisterWizardState.type'
import type { SignupAccount } from '@shared/types/auth/signup-account'

export const goToCompany = (
  set: SetRegisterWizardState,
  account: SignupAccount
) => set({ step: 2, account })
