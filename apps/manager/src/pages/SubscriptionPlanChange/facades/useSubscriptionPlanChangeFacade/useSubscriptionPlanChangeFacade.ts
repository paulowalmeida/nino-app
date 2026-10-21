import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'
import { useSubscriptionActions } from '@shared/hooks/account/useSubscriptionActions/useSubscriptionActions'
import { useSubscriptionPlans } from '@shared/hooks/account/useSubscriptionPlans/useSubscriptionPlans'

export const useSubscriptionPlanChangeFacade = () => {
  const subscription = useSubscription()
  const plans = useSubscriptionPlans()
  const actions = useSubscriptionActions()

  return {
    subscription: subscription.data,
    plans: plans.data ?? [],
    isPending: subscription.isPending || plans.isPending,
    isError: subscription.isError || plans.isError,
    isUpdating: actions.isUpdating,
    isUpdateError: actions.isError,
    changePlan: actions.changePlan,
  }
}
