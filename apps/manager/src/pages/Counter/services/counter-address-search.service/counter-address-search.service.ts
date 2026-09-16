import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import { api } from '@shared/services/http/http.service'

export const CounterAddressSearchService = {
  search: (
    state: string,
    city: string,
    street: string
  ): Promise<AddressSearchResult[]> =>
    api.getAll<AddressSearchResult[]>('addresses/search', {
      state,
      city,
      street,
    }),
}
