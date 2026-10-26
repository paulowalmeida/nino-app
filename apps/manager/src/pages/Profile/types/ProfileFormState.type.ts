import type { Profile } from '@shared/types/profile/profile'

import type { ProfileDraft } from './ProfileDraft.type'

export type ProfileFormState = {
  draft: ProfileDraft
  isDirty: boolean
  isSaving: boolean
  emailError: string | null
  saveError: string | null
  initializedProfileId: string | null
  initialize: (profile: Profile) => void
  change: (patch: Partial<ProfileDraft>) => void
  save: () => Promise<void>
}
