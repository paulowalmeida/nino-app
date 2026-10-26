export type SubscriptionInterestContactMethod =
  | 'EMAIL'
  | 'PHONE'
  | 'WHATSAPP'

export type CreateSubscriptionInterestInput = {
  contactName: string
  contactEmail: string
  contactPhone?: string
  preferredContactMethod: SubscriptionInterestContactMethod
  unitCount: number
  needs: string
  desiredFeatures?: string
}

export type SubscriptionInterestResponse = {
  id: string
  status: 'PENDING'
  createdAt: string
}
