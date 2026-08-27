import type { SetRegisterWizardState } from '@pages/Register/types/SetRegisterWizardState.type'

export const resetWizard = (set: SetRegisterWizardState) =>
  set({ step: 1, account: null })
