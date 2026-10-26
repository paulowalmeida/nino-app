import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { AccountService } from '@shared/services/account/account.service'
import type { SubscriptionPlan } from '@shared/types/profile/subscription'

export const useSubscriptionPlans = () =>
  useQuery<SubscriptionPlan[]>({
    queryKey: queryKeys.account.plans(),
    queryFn: AccountService.getPlans,
    retry: false,
  })
