import type { CredentialInfo } from '@shared/types/profile/credential-info'
import type { Profile } from '@shared/types/profile/profile'
import type { UpdateProfileRequest } from '@shared/types/profile/update-profile-request'

import type { ProfileStatus } from './ProfileStatus.type'

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
