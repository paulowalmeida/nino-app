import type { ProfileDraft } from '@pages/Profile/types/ProfileDraft.type'
import type { SetForm } from '@pages/Profile/types/SetForm.type'

export const changeProfileForm = (set: SetForm, patch: Partial<ProfileDraft>) =>
  set((current) => ({
    draft: { ...current.draft, ...patch },
    isDirty: true,
    emailError: null,
    saveError: null,
  }))
