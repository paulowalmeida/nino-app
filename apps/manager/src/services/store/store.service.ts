import type {
  CreatedStore,
  CreateStoreRequest,
  SlugAvailabilityResponse,
  StoreTypeOption,
  PauseRequest,
  TenantDetail,
  TenantPause,
  UpdateTenantRequest,
} from '@custom_types/store'
import { ApiFactory } from '@services/api/api.service'

const { get, getAll, create, patch, remove } = ApiFactory()

export const createStore = (data: CreateStoreRequest): Promise<CreatedStore> =>
  create<CreateStoreRequest, CreatedStore>('my/company/tenants', data)

export const listStoreTypes = (): Promise<StoreTypeOption[]> =>
  get<StoreTypeOption[]>('my/company/tenants/types')

export const checkSlug = (slug: string): Promise<SlugAvailabilityResponse> =>
  getAll<{ slug: string }, SlugAvailabilityResponse>(
    'my/company/tenants/slug-availability',
    { slug }
  )

export const getTenant = (tenantId: string): Promise<TenantDetail> =>
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
