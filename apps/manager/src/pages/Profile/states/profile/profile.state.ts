import { create } from 'zustand'

import type { CredentialInfo } from '@shared/types/profile/credential-info'
import type { Profile } from '@shared/types/profile/profile'
import type { UpdateProfileRequest } from '@shared/types/profile/update-profile-request'

type ProfileStatus = 'idle' | 'loading' | 'success' | 'error'

export type ProfileState = {
  profile: Profile | null
  status: ProfileStatus
  error: string | null
  isSaving: boolean
  isUpdatingEmail: boolean
  load: () => Promise<Profile | null>
  save: (data: UpdateProfileRequest) => Promise<Profile>
  updateEmail: (email: string) => Promise<CredentialInfo>
}

export type SetProfile = (partial: Partial<ProfileState>) => void
export type GetProfile = () => ProfileState

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
