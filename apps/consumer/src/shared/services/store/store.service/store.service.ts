import type { Store } from '@custom_types/store/store'
import { api } from '@shared/services/http/http.service'

export const storeService = {
  getBySlug: (slug: string): Promise<Store> =>
    api.get<Store>(`tenants/slug/${slug}`),
}
