export type ProfileDraft = { name: string; phone: string; email: string }

export type ProfileFormState = {
  draft: ProfileDraft
  isDirty: boolean
  isSaving: boolean
  emailError: string | null
  saveError: string | null
  initializedProfileId: string | null
  initialize: (profile: import('@shared/types/profile/profile').Profile) => void
  change: (patch: Partial<ProfileDraft>) => void
  save: () => Promise<void>
}

export type SetForm = (
  partial:
    | Partial<ProfileFormState>
    | ((state: ProfileFormState) => Partial<ProfileFormState>)
) => void
export type GetForm = () => ProfileFormState
