import type { SetRegisterWizardState } from '@pages/Register/types/SetRegisterWizardState.type'
import type { SignupCompany } from '@shared/types/auth/signup-company'

export const goToUnit = (
  set: SetRegisterWizardState,
  company: SignupCompany
) => set({ step: 3, company })
