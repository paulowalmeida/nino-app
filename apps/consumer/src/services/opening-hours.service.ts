import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import { api } from '@services/http.service'

export const getPublicOpeningHours = (
  tenantId: string
): Promise<PublicOpeningHours[]> =>
  api.get<PublicOpeningHours[]>(`tenants/${tenantId}/opening-hours/public`)
