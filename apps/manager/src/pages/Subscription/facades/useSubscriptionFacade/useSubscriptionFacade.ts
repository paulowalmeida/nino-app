import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'
import { useSubscriptionPlans } from '@shared/hooks/account/useSubscriptionPlans/useSubscriptionPlans'

import { useSubscriptionActions } from '../../hooks/useSubscriptionActions/useSubscriptionActions'

export const useSubscriptionFacade = () => {
  const { data, isPending, isError } = useSubscription()
  const plans = useSubscriptionPlans()
  const actions = useSubscriptionActions()

  return {
    subscription: data,
    isPending,
    isError,
    plans: plans.data ?? [],
    isPlansPending: plans.isPending,
    isPlansError: plans.isError,
    changePlan: actions.changePlan,
    cancelPlan: actions.cancelPlan,
    isUpdating: actions.isUpdating,
    isUpdateError: actions.isError,
  }
}
