import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import {
  toChannelBreakdownItems,
  toPaymentMethodBreakdownItems,
} from '@pages/Reports/adapters/sales-breakdown.adapter/sales-breakdown.adapter'
import { REPORTS_PERIODS } from '@pages/Reports/constants/reports.constants'
import { useReportsStatus } from '@pages/Reports/hooks/useReportsStatus/useReportsStatus'
import { useSalesSeriesByChannel } from '@pages/Reports/hooks/useSalesSeriesByChannel/useSalesSeriesByChannel'
import { useSalesSeriesByPaymentMethod } from '@pages/Reports/hooks/useSalesSeriesByPaymentMethod/useSalesSeriesByPaymentMethod'
import { useTimingReport } from '@pages/Reports/hooks/useTimingReport/useTimingReport'
import {
  dateToInput,
  parseInputDate,
  todayInput,
} from '@pages/Reports/utils/date-input'
import {
  CHANNEL_LABEL,
  PAYMENT_METHOD_LABEL,
} from '@shared/constants/order.constants'
import { useSalesReport } from '@shared/hooks/order/useSalesReport/useSalesReport'
import { useSalesSeries } from '@shared/hooks/order/useSalesSeries/useSalesSeries'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type { PeriodChoice } from '@shared/types/ui/period-choice'

export const useReportsFacade = () => {
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('periodo')
  const period: PeriodChoice = REPORTS_PERIODS.some(
    ({ id }) => id === requested
  )
    ? (requested as PeriodChoice)
    : 'today'
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const awaitingDates = period === 'custom' && (!customFrom || !customTo)
  const range = useMemo<ReportRangeParams | null>(() => {
    if (period !== 'custom') return { period }
    if (!customFrom || !customTo || customFrom > customTo) return null
    return { from: customFrom, to: customTo }
  }, [customFrom, customTo, period])
  const requestRange = range ?? { period: 'today' as const }
  const requestUnit = range ? unitId : null
  const reportQuery = useSalesReport(requestUnit, requestRange)
  const timingQuery = useTimingReport(requestUnit, requestRange)
  const channelQuery = useSalesSeriesByChannel(requestUnit, requestRange)
  const paymentQuery = useSalesSeriesByPaymentMethod(requestUnit, requestRange)
  const trendQuery = useSalesSeries(requestUnit, requestRange)
  const status = useReportsStatus(
    awaitingDates,
    range !== null,
    [reportQuery, timingQuery, channelQuery, paymentQuery, trendQuery],
    reportQuery.report?.orderCount
  )

  const setPeriod = (next: PeriodChoice) =>
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        params.set('periodo', next)
        return params
      },
      { replace: true }
    )

  return {
    range: requestRange,
    period,
    setPeriod,
    custom: {
      from: customFrom,
      to: customTo,
      setFrom: (date: Date | undefined) =>
        setCustomFrom(date ? dateToInput(date) : ''),
      setTo: (date: Date | undefined) =>
        setCustomTo(date ? dateToInput(date) : ''),
      fromDate: customFrom ? parseInputDate(customFrom) : undefined,
      toDate: customTo ? parseInputDate(customTo) : undefined,
      fromEndMonth: parseInputDate(customTo || todayInput()),
      toStartMonth: customFrom ? parseInputDate(customFrom) : undefined,
      toEndMonth: parseInputDate(todayInput()),
      awaitingDates,
    },
    status,
    report: reportQuery,
    trend: trendQuery,
    timing: timingQuery,
    series: {
      channel: channelQuery,
      payment: paymentQuery,
    },
    breakdown: {
      channel: toChannelBreakdownItems(
        reportQuery.report?.byChannel ?? [],
        (channel) => CHANNEL_LABEL[channel]
      ),
      payment: toPaymentMethodBreakdownItems(
        reportQuery.report?.byPaymentMethod ?? [],
        (method) => PAYMENT_METHOD_LABEL[method]
      ),
    },
    unitId,
    labels: { channel: CHANNEL_LABEL, payment: PAYMENT_METHOD_LABEL },
  }
}
