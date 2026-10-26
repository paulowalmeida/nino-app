import type {
  AddressPrediction,
  AddressSearchResult,
} from '@nino/lib/types/address/address-lookup'
import { api } from '@shared/services/http/http.service'

export const UnitAddressSearchService = {
  search: (
    unitId: string,
    street: string,
    state: string,
    sessionToken: string,
    city?: string
  ): Promise<AddressPrediction[]> =>
    api.getAll<AddressPrediction[]>('addresses/unit/search', {
      unitId,
      street,
      state,
      sessionToken,
      ...(city ? { city } : {}),
    }),

  details: (
    unitId: string,
    placeId: string,
    sessionToken: string
  ): Promise<AddressSearchResult> =>
    api.getAll<AddressSearchResult>(`addresses/unit/${placeId}/details`, {
      unitId,
      sessionToken,
    }),
}
