import type { ReportPeriod } from '@shared/types/ui/report-period'

export type ReportRangeParams =
  | { period: ReportPeriod; from?: never; to?: never }
  | { period?: never; from: string; to: string }
