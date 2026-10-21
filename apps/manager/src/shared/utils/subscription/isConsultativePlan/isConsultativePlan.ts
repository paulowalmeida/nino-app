import type { SubscriptionPlan } from '@shared/types/profile/subscription'

export const isConsultativePlan = (plan: Pick<SubscriptionPlan, 'slug'>) =>
  plan.slug === 'rede'
