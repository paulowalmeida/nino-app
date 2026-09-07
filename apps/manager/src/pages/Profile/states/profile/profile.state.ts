import { create } from 'zustand'

import type { ProfileState } from '@pages/Profile/types/ProfileState.type'

import { loadProfile } from './operations/load-profile/load-profile'
import { saveProfile } from './operations/save-profile/save-profile'
import { updateProfileEmail } from './operations/update-profile-email/update-profile-email'

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  status: 'idle',
  error: null,
  isSaving: false,
  isUpdatingEmail: false,
  load: () => loadProfile(set, get),
  save: (data) => saveProfile(set, data),
  updateEmail: (email) => updateProfileEmail(set, get, email),
}))
