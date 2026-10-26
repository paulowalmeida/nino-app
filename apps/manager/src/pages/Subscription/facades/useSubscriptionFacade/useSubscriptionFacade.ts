import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'
import { useSubscriptionActions } from '@shared/hooks/account/useSubscriptionActions/useSubscriptionActions'

export const useSubscriptionFacade = () => {
  const { data, isPending, isError } = useSubscription()
  const actions = useSubscriptionActions()

  return {
    subscription: data,
    isPending,
    isError,
    changePlan: actions.changePlan,
    cancelPlan: actions.cancelPlan,
    isUpdating: actions.isUpdating,
    isUpdateError: actions.isError,
  }
}
