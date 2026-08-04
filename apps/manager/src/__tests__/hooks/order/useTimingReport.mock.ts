import type { ReportRangeParams, TimingReport } from '@custom_types/order'

export const weekRange: ReportRangeParams = { period: 'week' }

export const timingReport: TimingReport = {
  averagePreparationMinutes: 18,
  averageDeliveryMinutes: 25,
  preparationSampleSize: 40,
  deliverySampleSize: 32,
}
