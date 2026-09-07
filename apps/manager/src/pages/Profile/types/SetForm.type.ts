import type { ProfileFormState } from './ProfileFormState.type'

export type SetForm = (
  partial:
    | Partial<ProfileFormState>
    | ((state: ProfileFormState) => Partial<ProfileFormState>)
) => void
