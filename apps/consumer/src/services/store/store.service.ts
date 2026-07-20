import type { Store } from '@custom_types/store/store'
import { get } from '@services/api/api.service'

export const getStoreBySlug = (slug: string): Promise<Store> =>
  get<Store>(`tenants/slug/${slug}`)
