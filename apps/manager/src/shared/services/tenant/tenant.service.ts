import { api } from '@shared/services/http/http.service'
import type { CreateStoreRequest } from '@shared/types/store/create-store-request'
import type { CreatedStore } from '@shared/types/store/created-store'
import type { PauseRequest } from '@shared/types/store/pause-request'
import type { StoreTypeOption } from '@shared/types/store/store-type-option'
import type { TenantDetail } from '@shared/types/store/tenant-detail'
import type { TenantPause } from '@shared/types/store/tenant-pause'
import type { UpdateTenantRequest } from '@shared/types/store/update-tenant-request'

type SlugAvailabilityResponse = {
  available: boolean
}

export const TenantService = {
  createStore: (data: CreateStoreRequest): Promise<CreatedStore> =>
    api.create<CreateStoreRequest, CreatedStore>('my/company/tenants', data),

  listStoreTypes: (): Promise<StoreTypeOption[]> =>
    api.get<StoreTypeOption[]>('my/company/tenants/types'),

  checkSlug: (slug: string): Promise<SlugAvailabilityResponse> =>
    api.getAll<SlugAvailabilityResponse>(
      'my/company/tenants/slug-availability',
      { slug }
    ),

  getById: (tenantId: string): Promise<TenantDetail> =>
    api.get<TenantDetail>(`tenants/${tenantId}`),

  updateTenant: (
    tenantId: string,
    data: UpdateTenantRequest
  ): Promise<TenantDetail> =>
    api.patch<UpdateTenantRequest, TenantDetail>(`tenants/${tenantId}`, data),

  getPause: (tenantId: string): Promise<TenantPause> =>
    api.get<TenantPause>(`tenants/${tenantId}/pause`),

  pauseStore: (tenantId: string, data: PauseRequest): Promise<TenantPause> =>
    api.patch<PauseRequest, TenantPause>(
      `tenants/${tenantId}/pause`,
      data
    ),

  resumeStore: (tenantId: string): Promise<TenantPause> =>
    api.patch<Record<string, never>, TenantPause>(
      `tenants/${tenantId}/resume`,
      {}
    ),

  removeTenant: (tenantId: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`tenants/${tenantId}`),

  setMainTenant: (tenantId: string): Promise<TenantDetail> =>
    api.patch<Record<string, never>, TenantDetail>(
      `tenants/${tenantId}/main`,
      {}
    ),
}
