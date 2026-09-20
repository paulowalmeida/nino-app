import type { CatalogDraft } from '@pages/Units/types/CatalogDraft.type'
import type { HomeDraft } from '@pages/Units/types/HomeDraft.type'
import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'
import type { TrackingDraft } from '@pages/Units/types/TrackingDraft.type'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

/** O rascunho da tela vira o documento que a API guarda. */
const toLabel = (value: string): string | null => value.trim() || null

export const toThemeConfig = (
  draft: UnitDraft,
  unit?: UnitDetail | null,
  shape?: ThemeConfig['shape'],
  tracking?: TrackingDraft,
  catalog?: CatalogDraft,
  home?: HomeDraft
): ThemeConfig => ({
  brand: {
    logoUrl: unit?.logoUrl ?? null,
    faviconUrl: null,
    bannerUrl: unit?.bannerUrl ?? null,
  },
  colors: {
    primary: draft.primaryColor || null,
    secondary: draft.secondaryColor || null,
    tertiary: draft.tertiaryColor || null,
    background: draft.backgroundColor || null,
    surface: draft.cardColor || null,
    text: draft.textColor || null,
    mutedText: draft.mutedTextColor || null,
    border: draft.borderColor || null,
  },
  typography: {
    headingFont: 'default',
    bodyFont: 'default',
  },
  shape: shape ?? { radius: 'soft', border: 'line' },
  loading: {
    type: draft.loadingType,
  },
  tracking: {
    stageLabels: {
      PENDING: toLabel(tracking?.stageLabels.PENDING ?? ''),
      PREPARING: toLabel(tracking?.stageLabels.PREPARING ?? ''),
      OUT_FOR_DELIVERY: toLabel(tracking?.stageLabels.OUT_FOR_DELIVERY ?? ''),
      READY_FOR_PICKUP: toLabel(tracking?.stageLabels.READY_FOR_PICKUP ?? ''),
      DELIVERED: toLabel(tracking?.stageLabels.DELIVERED ?? ''),
    },
    waitingMessage: toLabel(tracking?.waitingMessage ?? ''),
  },
  ...(catalog ? { catalog } : {}),
  ...(home ? { home } : {}),
})
