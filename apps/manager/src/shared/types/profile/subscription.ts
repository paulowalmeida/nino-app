export type Subscription = {
  id: string
  companyId: string
  isActive: boolean | null
  startedAt: string
  trialEndsAt: string | null
  expiresAt: string | null
  plan: {
    id: string
    name: string
    slug: string
    price: string
    maxUnits: number | null
  }
  subscriptionStatus: {
    id: string
    name: string
  }
}

export type SubscriptionPlan = Pick<
  Subscription['plan'],
  'id' | 'name' | 'slug' | 'price' | 'maxUnits'
>
