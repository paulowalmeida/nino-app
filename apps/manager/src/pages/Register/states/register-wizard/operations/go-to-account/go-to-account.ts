import type { SetRegisterWizardState } from '@pages/Register/types/SetRegisterWizardState.type'

/* WHY: a conta preenchida fica guardada — voltar um passo repõe os campos em
 * vez de pedir tudo de novo. */
export const goToAccount = (set: SetRegisterWizardState) => set({ step: 1 })
