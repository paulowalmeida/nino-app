import { useQuery } from '@tanstack/react-query'

import type { Subscription } from '@custom_types/account'
import { getSubscription } from '@services/account/account.service'

export const useSubscription = () =>
  useQuery<Subscription>({
    queryKey: ['account', 'subscription'],
    queryFn: getSubscription,
    retry: false,
  })
