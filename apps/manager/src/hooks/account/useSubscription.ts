import { useQuery } from '@tanstack/react-query'

import type { Subscription } from '@custom_types/account'
import { AccountService } from '@services/account.service'

export const useSubscription = () =>
  useQuery<Subscription>({
    queryKey: ['account', 'subscription'],
    queryFn: AccountService.getSubscription,
    retry: false,
  })
