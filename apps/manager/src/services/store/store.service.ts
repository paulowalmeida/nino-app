import type {
  CreatedStore,
  CreateStoreRequest,
  SlugAvailabilityResponse,
  StoreTypeOption,
} from '@custom_types/store'
import { ApiFactory } from '@services/api/api.service'

const { get, getAll, create } = ApiFactory()

export const createStore = (data: CreateStoreRequest): Promise<CreatedStore> =>
  create<CreateStoreRequest, CreatedStore>('my/company/tenants', data)

export const listStoreTypes = (): Promise<StoreTypeOption[]> =>
  get<StoreTypeOption[]>('my/company/tenants/types')

export const checkSlug = (slug: string): Promise<SlugAvailabilityResponse> =>
  getAll<{ slug: string }, SlugAvailabilityResponse>(
    'my/company/tenants/slug-availability',
    { slug }
  )
