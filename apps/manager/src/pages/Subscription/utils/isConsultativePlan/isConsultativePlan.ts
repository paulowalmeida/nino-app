import type { SubscriptionPlan } from '@shared/types/profile/subscription'

export const isConsultativePlan = (
  plan: Pick<SubscriptionPlan, 'slug'>
): boolean => plan.slug === 'rede'
