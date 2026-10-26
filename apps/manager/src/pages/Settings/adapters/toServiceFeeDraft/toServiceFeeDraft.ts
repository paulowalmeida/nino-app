import type { ServiceFeeDraft } from '@pages/Settings/types/ServiceFeeDraft.type'
import type { UnitSettings } from '@shared/types/settings/unit-settings.type'

export const toServiceFeeDraft = (settings: UnitSettings): ServiceFeeDraft => ({
  serviceFeeEnabled: settings.serviceFeeEnabled,
  serviceFeePercent: String(settings.serviceFeePercent).replace('.', ','),
})
