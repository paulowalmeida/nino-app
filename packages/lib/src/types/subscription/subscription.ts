import { SubscriptionStatus } from '../../enums'
import { PlanRecord } from '../plan/plan-record'

export type Subscription = {
  id: string
  companyId: string
  startedAt: string
  trialEndsAt: string | null
  currentPeriodStart: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
  plan: PlanRecord
  status: { id: string; name: SubscriptionStatus }
}
