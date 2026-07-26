import type {
  CredentialInfo,
  Profile,
  Subscription,
  UpdateEmailRequest,
  UpdateProfileRequest,
} from '@custom_types/account'
import { ApiFactory } from '@services/api/api.service'

const { get, patch } = ApiFactory()

export const getProfile = (): Promise<Profile> => get<Profile>('my/profile')

/** `PATCH /my/profile` não tem id: a última parte da rota entra no lugar. */
export const updateProfile = (
  data: UpdateProfileRequest
): Promise<Profile> =>
  patch<UpdateProfileRequest, Profile>('my', 'profile', data)

export const updateMyEmail = (email: string): Promise<CredentialInfo> =>
  patch<UpdateEmailRequest, CredentialInfo>('my/profile', 'email', { email })

export const getSubscription = (): Promise<Subscription> =>
  get<Subscription>('my/subscription')
