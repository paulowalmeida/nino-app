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
    maxTenants: number | null
  }
  subscriptionStatus: {
    id: string
    name: string
  }
}
