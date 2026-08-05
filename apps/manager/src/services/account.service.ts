import type { CredentialInfo } from '@custom_types/account/credential-info'
import type { Profile } from '@custom_types/account/profile'
import type { Subscription } from '@custom_types/account/subscription'
import type { UpdateEmailRequest } from '@custom_types/account/update-email-request'
import type { UpdateProfileRequest } from '@custom_types/account/update-profile-request'
import { api } from '@services/http.service'

export const AccountService = {
  getProfile: (): Promise<Profile> => api.get<Profile>('my/profile'),

  updateProfile: (data: UpdateProfileRequest): Promise<Profile> =>
    api.patch<UpdateProfileRequest, Profile>('my', 'profile', data),

  updateMyEmail: (email: string): Promise<CredentialInfo> =>
    api.patch<UpdateEmailRequest, CredentialInfo>('my/profile', 'email', {
      email,
    }),

  getSubscription: (): Promise<Subscription> =>
    api.get<Subscription>('my/subscription'),
}
