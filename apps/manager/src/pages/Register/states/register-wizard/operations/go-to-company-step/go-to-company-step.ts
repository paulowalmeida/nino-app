import type { SetRegisterWizardState } from '@pages/Register/types/SetRegisterWizardState.type'

export const goToCompanyStep = (set: SetRegisterWizardState) => set({ step: 2 })
