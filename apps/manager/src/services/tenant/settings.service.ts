import type {
  DeliveryZone,
  OpeningHours,
  TenantPhone,
  TenantSettings,
  UpdateTenantSettingsRequest,
} from '@custom_types/settings'
import type { PaymentMethod } from '@custom_types/order'
import { ApiFactory } from '@services/api/api.service'

const { get, create, patch, update, remove } = ApiFactory()

type Page<T> = {
  data: T[]
  pagination: { total: number }
}

export const getSettings = (tenantId: string): Promise<TenantSettings> =>
  get<TenantSettings>(`tenants/${tenantId}/settings`)

/**
 * Fatia pública das regras: o balcão precisa das formas aceitas e quem
 * opera pode ser STAFF, que não lê as settings completas.
 */
export const getAcceptedPayments = (
  tenantId: string
): Promise<{ acceptedPaymentMethods: PaymentMethod[] }> =>
  get<{ acceptedPaymentMethods: PaymentMethod[] }>(
    `tenants/${tenantId}/settings/public`
  )

/**
 * `PUT /tenants/:id/settings` não tem id de recurso: o `update` da factory
 * monta `<url>/<id>`, então a última parte da rota entra no lugar do id.
 */
export const saveSettings = (
  tenantId: string,
  data: UpdateTenantSettingsRequest
): Promise<TenantSettings> =>
  update<UpdateTenantSettingsRequest, TenantSettings>(
    `tenants/${tenantId}`,
    'settings',
    data
  )

export const listOpeningHours = (
  tenantId: string
): Promise<Page<OpeningHours>> =>
  get<Page<OpeningHours>>(`tenants/${tenantId}/opening-hours`)

/**
 * `isOpen` vai explícito: o banco assume `true` por padrão, então omitir o
 * campo faz um dia criado como fechado voltar aberto da API.
 */
export const createOpeningHours = (
  tenantId: string,
  data: {
    dayOfWeek: number
    openTime: string
    closeTime: string
    isOpen: boolean
  }
): Promise<OpeningHours> =>
  create<typeof data, OpeningHours>(`tenants/${tenantId}/opening-hours`, data)

export const updateOpeningHours = (
  tenantId: string,
  id: string,
  data: { openTime?: string; closeTime?: string; isOpen?: boolean }
): Promise<OpeningHours> =>
  patch<typeof data, OpeningHours>(
    `tenants/${tenantId}/opening-hours`,
    id,
    data
  )

export const removeOpeningHours = (
  tenantId: string,
  id: string
): Promise<{ message: string }> =>
  remove<{ message: string }>(`tenants/${tenantId}/opening-hours`, id)

export const listDeliveryZones = (
  tenantId: string
): Promise<Page<DeliveryZone>> =>
  get<Page<DeliveryZone>>(`tenants/${tenantId}/delivery-zones`)

export const createDeliveryZone = (
  tenantId: string,
  data: { name: string; fee: number }
): Promise<DeliveryZone> =>
  create<typeof data, DeliveryZone>(
    `tenants/${tenantId}/delivery-zones`,
    data
  )

export const updateDeliveryZone = (
  tenantId: string,
  id: string,
  data: { name?: string; fee?: number; isActive?: boolean }
): Promise<DeliveryZone> =>
  patch<typeof data, DeliveryZone>(
    `tenants/${tenantId}/delivery-zones`,
    id,
    data
  )

export const removeDeliveryZone = (
  tenantId: string,
  id: string
): Promise<{ message: string }> =>
  remove<{ message: string }>(`tenants/${tenantId}/delivery-zones`, id)

export const listPhones = (tenantId: string): Promise<Page<TenantPhone>> =>
  get<Page<TenantPhone>>(`tenants/${tenantId}/phones`)

export const createPhone = (
  tenantId: string,
  phone: string
): Promise<TenantPhone> =>
  create<{ phone: string }, TenantPhone>(`tenants/${tenantId}/phones`, {
    phone,
  })

export const updatePhone = (
  tenantId: string,
  id: string,
  phone: string
): Promise<TenantPhone> =>
  patch<{ phone: string }, TenantPhone>(`tenants/${tenantId}/phones`, id, {
    phone,
  })

export const removePhone = (
  tenantId: string,
  id: string
): Promise<{ message: string }> =>
  remove<{ message: string }>(`tenants/${tenantId}/phones`, id)
