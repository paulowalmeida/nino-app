import { toThemeColors } from '@pages/Units/adapters/toThemeColors/toThemeColors'
import { toUnitDraft } from '@pages/Units/adapters/toUnitDraft/toUnitDraft'
import type { UnitTheme } from '@pages/Units/types/UnitTheme.type'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

/** Converte uma versão salva no documento editável do estúdio. */
export const toUnitThemeDraft = (
  unit: UnitDetail,
  theme: UnitTheme
): UnitDraft => ({
  ...toUnitDraft(unit),
  ...toThemeColors(theme.config),
  logoUrl: theme.config.brand.logoUrl,
  bannerUrl: theme.config.brand.bannerUrl,
})
