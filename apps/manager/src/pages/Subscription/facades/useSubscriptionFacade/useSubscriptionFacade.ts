import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'

export const useSubscriptionFacade = () => {
  const { data, isPending, isError } = useSubscription()

  return {
    subscription: data,
    isPending,
    isError,
  }
}
