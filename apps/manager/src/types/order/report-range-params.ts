import type { ReportPeriod } from '@custom_types/ui/report-period'

/**
 * Recorte pedido à API: preset OU dias soltos, nunca instante. Quem traduz
 * dia em instante é o backend, no fuso da loja.
 */
export type ReportRangeParams =
  | { period: ReportPeriod; from?: never; to?: never }
  | { period?: never; from: string; to: string }
