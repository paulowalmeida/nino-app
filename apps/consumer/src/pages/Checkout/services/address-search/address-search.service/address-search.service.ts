import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import { api } from '@shared/services/http/http.service'

export const checkoutAddressSearchService = {
  search: (
    unitId: string,
    street: string,
    state: string
  ): Promise<AddressSearchResult[]> =>
    api.getAll<AddressSearchResult[]>('addresses/search', {
      unitId,
      street,
      state,
    }),
}
