import type {
  AddressPrediction,
  AddressSearchResult,
} from '@nino/lib/types/address/address-lookup'
import { api } from '@shared/services/http/http.service'

export const storeAddressSearchService = {
  search: (
    unitId: string,
    street: string,
    state: string,
    sessionToken: string
  ): Promise<AddressPrediction[]> =>
    api.getAll<AddressPrediction[]>('addresses/guest/search', {
      unitId,
      street,
      state,
      sessionToken,
    }),

  details: (
    unitId: string,
    placeId: string,
    sessionToken: string
  ): Promise<AddressSearchResult> =>
    api.getAll<AddressSearchResult>(`addresses/guest/${placeId}/details`, {
      unitId,
      sessionToken,
    }),
}
