import { useSubscriptionInterest } from '../../hooks/useSubscriptionInterest/useSubscriptionInterest'

export const useSubscriptionInterestFacade = () => {
  const interest = useSubscriptionInterest()

  return {
    requestInterest: interest.mutate,
    isRequestingInterest: interest.isPending,
    isRequestInterestError: interest.isError,
  }
}
