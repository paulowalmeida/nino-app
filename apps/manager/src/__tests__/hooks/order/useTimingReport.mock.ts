import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type { TimingReport } from '@custom_types/order/timing-report'
export const weekRange: ReportRangeParams = { period: 'week' }

export const timingReport: TimingReport = {
  averagePreparationMinutes: 18,
  averageDeliveryMinutes: 25,
  preparationSampleSize: 40,
  deliverySampleSize: 32,
}
