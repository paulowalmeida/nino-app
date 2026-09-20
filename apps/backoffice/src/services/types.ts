export type BackofficeRole = 'ADMIN' | 'SUPPORT'

export type BackofficeUser = {
  id: string
  name: string
  role: BackofficeRole
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export type SubscriptionInterestStatus =
  | 'PENDING'
  | 'IN_CONTACT'
  | 'CONVERTED'
  | 'CLOSED'

export type SubscriptionInterest = {
  id: string
  companyId: string
  contactName: string
  contactEmail: string
  contactPhone: string | null
  preferredContactMethod: 'EMAIL' | 'PHONE' | 'WHATSAPP'
  unitCount: number
  needs: string
  desiredFeatures: string | null
  status: SubscriptionInterestStatus
  backofficeNotes: string | null
  statusUpdatedAt: string
  createdAt: string
  updatedAt: string
  company: {
    id: string
    name: string
    cnpj: string
  }
  requestedBy: {
    id: string
    name: string
  }
  statusUpdatedBy: {
    id: string
    name: string
  } | null
}

export type Pagination = {
  page: number
  size: number
  total: number
  totalPages: number
  previousPage: number | null
  nextPage: number | null
}

export type Paginated<T> = {
  data: T[]
  pagination: Pagination
}

export type LoginInput = {
  email: string
  password: string
}

export type UpdateInterestStatusInput = {
  status: SubscriptionInterestStatus
  backofficeNotes?: string
}
