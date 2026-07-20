import type {
  Profile,
  Subscription,
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

export const getSubscription = (): Promise<Subscription> =>
  get<Subscription>('my/subscription')
