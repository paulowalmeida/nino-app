import type { Store } from '@custom_types/store/store'
import { api } from '@services/http.service'

export const getStoreBySlug = (slug: string): Promise<Store> =>
  api.get<Store>(`tenants/slug/${slug}`)
