import type { PublicUnitSettings } from '@custom_types/settings/public-unit-settings'
import { api } from '@shared/services/http/http.service'

export const settingsService = {
  getPublic: (unitId: string): Promise<PublicUnitSettings> =>
    api.get<PublicUnitSettings>(`units/${unitId}/settings/public`),
}
