import type { PromotionSummaryParts } from '@shared/types/marketing/promotion-summary-parts.type'

// CONSTRAINT: espelha o promotionLabel do Consumer — só o prazo final entra na faixa.
export const promotionStripLabel = ({
  headline,
  period,
}: Pick<PromotionSummaryParts, 'headline' | 'period'>): string =>
  period?.startsWith('até') ? `${headline} · ${period}` : headline
