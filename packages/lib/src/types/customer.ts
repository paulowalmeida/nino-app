import { LoyaltyTransactionType, NotificationType } from '../enums'
import { PaginatedResponse, PaginatedQuery } from './common'

export interface Customer {
  id: string
  cpf: string | null
  createdAt: string
  updatedAt: string
  user: { name: string; phone: string | null }
}

export interface CreateCustomerRequest {
  userId: string
  cpf?: string
}

export interface UpdateCustomerRequest {
  cpf?: string
}

export type CustomerPaginatedResponse = PaginatedResponse<Customer>

export interface CustomerAddress {
  id: string
  customerId: string
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  country: string | null
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerAddressRequest {
  customerId: string
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  isPrimary?: boolean
  country?: string
}

export type UpdateCustomerAddressRequest = Partial<CreateCustomerAddressRequest>

export interface CustomerPaymentMethod {
  id: string
  customerId: string
  brand: string | null
  lastFour: string | null
  expiresAt: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
  method: { name: string; description: string | null }
}

export interface CreateCustomerPaymentMethodRequest {
  methodId: string
  gatewayToken: string
  brand?: string
  lastFour?: string
  expiresAt?: string
  isDefault?: boolean
}

export interface UpdateCustomerPaymentMethodRequest {
  brand?: string
  lastFour?: string
  expiresAt?: string
  isDefault?: boolean
}

export type CustomerPaymentMethodPaginatedResponse =
  PaginatedResponse<CustomerPaymentMethod>

export interface CustomerNotificationPreference {
  id: string
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  createdAt: string
  updatedAt: string
  notificationType: { id: string; name: NotificationType }
}

export interface UpsertCustomerNotificationPreferenceRequest {
  emailEnabled?: boolean
  pushEnabled?: boolean
  smsEnabled?: boolean
}

export interface CustomerTenant {
  id: string
  loyaltyPoints: number
  createdAt: string
  updatedAt: string
  tenant: {
    id: string
    slug: string
    customName: string | null
    logoUrl: string | null
  }
}

export interface CreateCustomerTenantRequest {
  tenantId: string
}

export type CustomerTenantPaginatedResponse = PaginatedResponse<CustomerTenant>

export interface LoyaltyTransaction {
  id: string
  orderId: string | null
  type: LoyaltyTransactionType
  points: number
  description: string | null
  createdAt: string
  updatedAt: string
  tenant: { id: string; slug: string; customName: string | null }
}

export interface CreateLoyaltyTransactionRequest {
  tenantId: string
  orderId?: string
  type: LoyaltyTransactionType
  points: number
  description?: string
}

export interface LoyaltyTransactionQuery extends PaginatedQuery {
  tenantId?: string
  type?: LoyaltyTransactionType
}

export type LoyaltyTransactionPaginatedResponse =
  PaginatedResponse<LoyaltyTransaction>
