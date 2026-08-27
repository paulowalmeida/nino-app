import type { RegisterWizardState } from './RegisterWizardState.type'

export type SetRegisterWizardState = (
  state:
    | Partial<RegisterWizardState>
    | ((current: RegisterWizardState) => Partial<RegisterWizardState>)
) => void
