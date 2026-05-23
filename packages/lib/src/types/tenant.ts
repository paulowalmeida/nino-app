import { TenantStatus, TenantType } from '../enums'
import { PaginatedResponse, PaginatedQuery } from './common'
import { Company } from './company'

export interface Tenant {
  id: string
  slug: string
  customName: string | null
  logoUrl: string | null
  favicon: string | null
  primaryColor: string | null
  secondaryColor: string | null
  customDomain: string | null
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  country: string | null
  timezone: string | null
  createdAt: string
  updatedAt: string
  status: { id: string; name: TenantStatus }
  type: { id: string; name: TenantType }
  company: Company
}

export interface CreateTenantRequest {
  slug: string
  companyId: string
  statusId: string
  typeId: string
  zipCode: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  customName?: string
  logoUrl?: string
  favicon?: string
  primaryColor?: string
  secondaryColor?: string
  customDomain?: string
  complement?: string
  country?: string
  timezone?: string
}

export interface UpdateTenantRequest extends Partial<CreateTenantRequest> {}

export interface TenantQuery extends PaginatedQuery {
  companyId?: string
}

export interface TenantPaginatedResponse extends PaginatedResponse<Tenant> {}

export interface TenantSettings {
  id: string
  tenantId: string
  requireAccount: boolean
  requireCpf: boolean
  allowGuestOrder: boolean
  deliveryFee: number
  minOrderAmount: number
  deliveryRadius: number
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  loyaltyEnabled: boolean
  loyaltyPointsPerOrder: number
  loyaltyPointValue: number
  allowSharedStaff: boolean
  createdAt: string
  updatedAt: string
}

export interface UpsertTenantSettingsRequest {
  requireAccount?: boolean
  requireCpf?: boolean
  allowGuestOrder?: boolean
  deliveryFee?: number
  minOrderAmount?: number
  deliveryRadius?: number
  isDeliveryEnabled?: boolean
  isPickupEnabled?: boolean
  loyaltyEnabled?: boolean
  loyaltyPointsPerOrder?: number
  loyaltyPointValue?: number
  allowSharedStaff?: boolean
}

export interface OpeningHours {
  id: string
  tenantId: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateOpeningHoursRequest {
  tenantId?: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen?: boolean
}

export interface UpdateOpeningHoursRequest {
  openTime?: string
  closeTime?: string
  isOpen?: boolean
}

export interface TenantPhone {
  id: string
  tenantId: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface CreateTenantPhoneRequest {
  tenantId?: string
  phone: string
}

export interface UpdateTenantPhoneRequest {
  phone?: string
}

export interface TenantPaymentMethod {
  id: string
  tenantId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  method: { name: string; description: string | null }
}

export interface CreateTenantPaymentMethodRequest {
  methodId: string
}

export interface UpdateTenantPaymentMethodRequest {
  isActive: boolean
}

export interface TenantPaymentMethodPaginatedResponse extends PaginatedResponse<TenantPaymentMethod> {}
