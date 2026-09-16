import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import { api } from '@shared/services/http/http.service'

export const CounterAddressSearchService = {
  search: (street: string): Promise<AddressSearchResult[]> =>
    api.getAll<AddressSearchResult[]>('addresses/search', { street }),
}
