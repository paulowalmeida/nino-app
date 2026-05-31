import { SubscriptionStatus } from '../enums'
import { PaginatedResponse } from './common'
import { PlanRecord } from './plan'

export interface Subscription {
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

export interface CreateSubscriptionRequest {
  companyId: string
  planId: string
  subscriptionStatusId: string
}

export interface ActivateSubscriptionRequest {
  subscriptionStatusId: string
}

export interface CancelSubscriptionRequest {
  subscriptionStatusId: string
}

export interface ChangePlanRequest {
  planId: string
}

export type SubscriptionPaginatedResponse = PaginatedResponse<Subscription>
