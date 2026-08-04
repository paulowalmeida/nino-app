import type {
  CredentialInfo,
  Profile,
  Subscription,
  UpdateEmailRequest,
  UpdateProfileRequest,
} from '@custom_types/account'
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
