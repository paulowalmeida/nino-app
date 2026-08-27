import type { ProfileDraft } from '../../profile-form.state'
import type { SetForm } from '../../profile-form.state'

export const changeProfileForm = (set: SetForm, patch: Partial<ProfileDraft>) =>
  set((current) => ({
    draft: { ...current.draft, ...patch },
    isDirty: true,
    emailError: null,
    saveError: null,
  }))
