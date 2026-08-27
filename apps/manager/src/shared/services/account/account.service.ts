import { api } from '@shared/services/http/http.service'
import type { Subscription } from '@shared/types/profile/subscription'

export const AccountService = {
  getSubscription: (): Promise<Subscription> =>
    api.get<Subscription>('my/subscription'),
}
