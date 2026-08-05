import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type { SalesReport } from '@custom_types/order/sales-report'
export const weekRange: ReportRangeParams = { period: 'week' }

export const salesReport: SalesReport = {
  revenue: 1500,
  orderCount: 30,
  averageTicket: 50,
  topProducts: [],
}
