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
