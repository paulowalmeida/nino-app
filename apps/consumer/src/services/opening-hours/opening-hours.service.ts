import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import { get } from '@services/api/api.service'

export const getPublicOpeningHours = (
  tenantId: string
): Promise<PublicOpeningHours[]> =>
  get<PublicOpeningHours[]>(`tenants/${tenantId}/opening-hours/public`)
