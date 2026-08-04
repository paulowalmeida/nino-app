import type { ReportRangeParams, SalesReport } from '@custom_types/order'

export const weekRange: ReportRangeParams = { period: 'week' }

export const salesReport: SalesReport = {
  revenue: 1500,
  orderCount: 30,
  averageTicket: 50,
  topProducts: [],
}
