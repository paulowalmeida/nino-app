import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'
import { useSubscriptionPlans } from '@shared/hooks/account/useSubscriptionPlans/useSubscriptionPlans'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { AccountService } from '@shared/services/account/account.service'
import type { Subscription } from '@shared/types/profile/subscription'

export const useSubscriptionFacade = () => {
  const { data, isPending, isError } = useSubscription()
  const plans = useSubscriptionPlans()
  const queryClient = useQueryClient()
  const updateSubscription = useMutation({
    mutationFn: ({ planId }: { planId?: string }) =>
      planId
        ? AccountService.changePlan(planId)
        : AccountService.cancelSubscription(),
    onSuccess: (next) => {
      queryClient.setQueryData<Subscription>(
        queryKeys.account.subscription(),
        next
      )
      toast.success('Assinatura atualizada')
    },
  })

  return {
    subscription: data,
    isPending,
    isError,
    plans: plans.data ?? [],
    isPlansPending: plans.isPending,
    isPlansError: plans.isError,
    changePlan: (planId: string) => updateSubscription.mutateAsync({ planId }),
    cancelPlan: () => updateSubscription.mutateAsync({}),
    isUpdating: updateSubscription.isPending,
  }
}
