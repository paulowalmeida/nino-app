import { useSubscription } from '@hooks/account/useSubscription'

type UnitLimit = {
  limit: number | null
  planName: string
  isFull: boolean
  isPending: boolean
}

export const useUnitLimit = (unitCount: number): UnitLimit => {
  const { data: subscription, isPending } = useSubscription()
  const limit = subscription?.plan.maxTenants ?? null

  return {
    limit,
    planName: subscription?.plan.name ?? '',
    isFull: limit !== null && unitCount >= limit,
    isPending,
  }
}
