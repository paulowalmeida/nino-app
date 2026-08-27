import type { Profile } from '@shared/types/profile/profile'
import { formatPhone } from '@shared/utils/phone/phone'

import type { GetForm, ProfileFormState, SetForm } from '../../profile-form.state'

const draftFromProfile = (profile: Profile) => ({
  name: profile.name,
  phone: profile.phone ? formatPhone(profile.phone) : '',
  email: profile.credentials[0]?.email ?? '',
})

export const initializeProfileForm = (set: SetForm, get: GetForm, profile: Profile) => {
  const current = get()
  if (current.isDirty || current.initializedProfileId === profile.id) return
  set({
    draft: draftFromProfile(profile),
    isDirty: false,
    emailError: null,
    saveError: null,
    initializedProfileId: profile.id,
  })
}

export { draftFromProfile }
export type { ProfileFormState }
