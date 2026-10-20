import type { ReportsStatus } from '@pages/Reports/types/ReportsStatus.type'

type ReportQueryState = {
  isPending: boolean
  isError: boolean
}

export const useReportsStatus = (
  awaitingDates: boolean,
  hasValidRange: boolean,
  queries: ReportQueryState[],
  orderCount: number | undefined
): ReportsStatus => {
  if (awaitingDates) return 'awaiting-dates'
  if (!hasValidRange) return 'error'
  if (queries.some(({ isError }) => isError)) return 'error'
  if (queries.some(({ isPending }) => isPending)) return 'pending'
  if (orderCount === 0) return 'empty'

  return 'ready'
}
