import { api, sessionHint } from './http.service'
import {
  BackofficeUser,
  LoginInput,
  Paginated,
  SubscriptionInterest,
  SubscriptionInterestStatus,
  UpdateInterestStatusInput,
} from './types'

export const backofficeService = {
  getMe: () => api.get<BackofficeUser>('backoffice/auth/me'),

  login: async (input: LoginInput) => {
    const user = await api.create<LoginInput, BackofficeUser>(
      'backoffice/auth/login',
      input,
    )
    sessionHint.mark()
    return user
  },

  logout: async () => {
    try {
      await api.create<undefined, unknown>('backoffice/auth/logout')
    } finally {
      sessionHint.clear()
    }
  },

  listSubscriptionInterests: (status?: SubscriptionInterestStatus) =>
    api.getAll<Paginated<SubscriptionInterest>>('subscription-interests', {
      page: 1,
      size: 50,
      ...(status ? { status } : {}),
    }),

  getSubscriptionInterest: (id: string) =>
    api.get<SubscriptionInterest>(`subscription-interests/${id}`),

  updateSubscriptionInterestStatus: (
    id: string,
    input: UpdateInterestStatusInput,
  ) =>
    api.patch<UpdateInterestStatusInput, SubscriptionInterest>(
      `subscription-interests/${id}/status`,
      input,
    ),
}
