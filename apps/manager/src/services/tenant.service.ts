import type {
  CreatedStore,
  CreateStoreRequest,
  PauseRequest,
  StoreTypeOption,
  TenantDetail,
  TenantPause,
  UpdateTenantRequest,
} from '@custom_types/store'
import { api } from '@services/http.service'

type SlugAvailabilityResponse = {
  available: boolean
}

export const TenantService = {
  createStore: (data: CreateStoreRequest): Promise<CreatedStore> =>
    api.create<CreateStoreRequest, CreatedStore>('my/company/tenants', data),

  listStoreTypes: (): Promise<StoreTypeOption[]> =>
    api.get<StoreTypeOption[]>('my/company/tenants/types'),

  checkSlug: (slug: string): Promise<SlugAvailabilityResponse> =>
    api.getAll<{ slug: string }, SlugAvailabilityResponse>(
      'my/company/tenants/slug-availability',
      { slug }
    ),

  getById: (tenantId: string): Promise<TenantDetail> =>
    api.get<TenantDetail>(`tenants/${tenantId}`),

  updateTenant: (
    tenantId: string,
    data: UpdateTenantRequest
  ): Promise<TenantDetail> =>
    api.patch<UpdateTenantRequest, TenantDetail>('tenants', tenantId, data),

  getPause: (tenantId: string): Promise<TenantPause> =>
    api.get<TenantPause>(`tenants/${tenantId}/pause`),

  pauseStore: (tenantId: string, data: PauseRequest): Promise<TenantPause> =>
    api.patch<PauseRequest, TenantPause>('tenants', `${tenantId}/pause`, data),

  resumeStore: (tenantId: string): Promise<TenantPause> =>
    api.patch<Record<string, never>, TenantPause>(
      'tenants',
      `${tenantId}/resume`,
      {}
    ),

  removeTenant: (tenantId: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>('tenants', tenantId),

  setMainTenant: (tenantId: string): Promise<TenantDetail> =>
    api.patch<Record<string, never>, TenantDetail>(
      'tenants',
      `${tenantId}/main`,
      {}
    ),
}
