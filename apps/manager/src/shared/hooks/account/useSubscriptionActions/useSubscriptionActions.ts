import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { AccountService } from '@shared/services/account/account.service'
import type { Subscription } from '@shared/types/profile/subscription'

export const useSubscriptionActions = () => {
  const queryClient = useQueryClient()

  const changePlan = useMutation<Subscription, Error, string>({
    meta: {
      success: 'Plano alterado',
      errorTitle: 'O plano não foi alterado',
    },
    mutationFn: (planId) => AccountService.changePlan(planId),
    onSuccess: (subscription) => {
      queryClient.setQueryData<Subscription>(
        queryKeys.account.subscription(),
        subscription
      )
    },
  })

  const cancelPlan = useMutation<Subscription, Error, void>({
    meta: {
      success: 'Assinatura cancelada',
      errorTitle: 'A assinatura não foi cancelada',
    },
    mutationFn: () => AccountService.cancelSubscription(),
    onSuccess: (subscription) => {
      queryClient.setQueryData<Subscription>(
        queryKeys.account.subscription(),
        subscription
      )
    },
  })

  return {
    changePlan: changePlan.mutateAsync,
    cancelPlan: cancelPlan.mutateAsync,
    isUpdating: changePlan.isPending || cancelPlan.isPending,
    isError: changePlan.isError || cancelPlan.isError,
  }
}
