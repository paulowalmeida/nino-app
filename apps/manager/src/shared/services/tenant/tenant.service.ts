import { api } from '@shared/services/http/http.service'
import type { CreateStoreRequest } from '@shared/types/store/create-store-request'
import type { CreatedStore } from '@shared/types/store/created-store'
import type { PauseRequest } from '@shared/types/store/pause-request'
import type { StoreTypeOption } from '@shared/types/store/store-type-option'
import type { TenantDetail } from '@shared/types/store/tenant-detail'
import type { TenantPause } from '@shared/types/store/tenant-pause'
import type { UpdateTenantRequest } from '@shared/types/store/update-tenant-request'
import type { UnitDraft } from '@shared/types/store/unit-draft'

type SlugAvailabilityResponse = {
  available: boolean
}

export const TenantService = {
  uploadBrandAsset: async (
    tenantId: string,
    asset: 'logo' | 'banner',
    file: File
  ): Promise<TenantDetail> => {
    const body = new FormData()
    body.append('file', file)
    return api.createFormData<TenantDetail>(
      `tenants/${tenantId}/branding/${asset}`,
      body
    )
  },

  saveTenant: async (
    tenantId: string,
    draft: UnitDraft
  ): Promise<TenantDetail> => {
    const { logoFile, bannerFile, ...data } = draft
    let logoUrl: string | undefined
    let bannerUrl: string | undefined

    if (logoFile)
      logoUrl = (
        await TenantService.uploadBrandAsset(tenantId, 'logo', logoFile)
      ).logoUrl
    if (bannerFile)
      bannerUrl = (
        await TenantService.uploadBrandAsset(tenantId, 'banner', bannerFile)
      ).bannerUrl

    return TenantService.updateTenant(tenantId, { ...data, logoUrl, bannerUrl })
  },

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
