import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { AccountService } from '@shared/services/account/account.service'
import type { Subscription } from '@shared/types/profile/subscription'

export const useSubscription = () =>
  useQuery<Subscription>({
    queryKey: queryKeys.account.subscription(),
    queryFn: AccountService.getSubscription,
    retry: false,
  })
