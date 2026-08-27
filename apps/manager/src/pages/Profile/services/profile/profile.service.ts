import { api } from '@shared/services/http/http.service'
import type { CredentialInfo } from '@shared/types/profile/credential-info'
import type { Profile } from '@shared/types/profile/profile'
import type { UpdateEmailRequest } from '@shared/types/profile/update-email-request'
import type { UpdateProfileRequest } from '@shared/types/profile/update-profile-request'

export const ProfileService = {
  getProfile: (): Promise<Profile> => api.get<Profile>('my/profile'),

  updateProfile: (data: UpdateProfileRequest): Promise<Profile> =>
    api.patch<UpdateProfileRequest, Profile>('my/profile', data),

  updateMyEmail: (email: string): Promise<CredentialInfo> =>
    api.patch<UpdateEmailRequest, CredentialInfo>('my/profile/email', {
      email,
    }),
}
