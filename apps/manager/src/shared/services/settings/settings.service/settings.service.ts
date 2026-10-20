import { api } from '@shared/services/http/http.service'
import type { PublicUnitSettings } from '@shared/types/settings/public-unit-settings'
import type { UnitSettings } from '@shared/types/settings/unit-settings.type'
import type { UpdateUnitSettingsRequest } from '@shared/types/settings/update-unit-settings-request.type'

export const SettingsService = {
  getSettings: (unitId: string): Promise<UnitSettings> =>
    api.get<UnitSettings>(`units/${unitId}/settings`),

  getPublicSettings: (unitId: string): Promise<PublicUnitSettings> =>
    api.get<PublicUnitSettings>(`units/${unitId}/settings/public`),

  saveSettings: (
    unitId: string,
    data: UpdateUnitSettingsRequest
  ): Promise<UnitSettings> =>
    api.update<UpdateUnitSettingsRequest, UnitSettings>(
      `units/${unitId}/settings`,
      data
    ),
}
