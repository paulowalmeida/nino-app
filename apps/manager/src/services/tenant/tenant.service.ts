import type {
  PauseRequest,
  TenantDetail,
  TenantPause,
  UpdateTenantRequest,
} from '@custom_types/store'
import { ApiFactory } from '@services/api/api.service'

const { get, patch, remove } = ApiFactory()

export const getById = (tenantId: string): Promise<TenantDetail> =>
  get<TenantDetail>(`tenants/${tenantId}`)

export const updateTenant = (
  tenantId: string,
  data: UpdateTenantRequest
): Promise<TenantDetail> =>
  patch<UpdateTenantRequest, TenantDetail>('tenants', tenantId, data)

export const getPause = (tenantId: string): Promise<TenantPause> =>
  get<TenantPause>(`tenants/${tenantId}/pause`)

export const pauseStore = (
  tenantId: string,
  data: PauseRequest
): Promise<TenantPause> =>
  patch<PauseRequest, TenantPause>('tenants', `${tenantId}/pause`, data)

export const resumeStore = (tenantId: string): Promise<TenantPause> =>
  patch<Record<string, never>, TenantPause>(
    'tenants',
    `${tenantId}/resume`,
    {}
  )

/** Fecha a unidade. A empresa e as outras lojas seguem de pé. */
export const removeTenant = (tenantId: string): Promise<{ message: string }> =>
  remove<{ message: string }>('tenants', tenantId)

export const setMainTenant = (tenantId: string): Promise<TenantDetail> =>
  patch<Record<string, never>, TenantDetail>('tenants', `${tenantId}/main`, {})
