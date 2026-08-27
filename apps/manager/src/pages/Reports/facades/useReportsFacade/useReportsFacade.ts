import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import {
  toChannelBreakdownItems,
  toPaymentMethodBreakdownItems,
} from '@pages/Reports/adapters/sales-breakdown.adapter/sales-breakdown.adapter'
import {
  REPORTS_PERIODS,
} from '@pages/Reports/constants/reports.constants'
import { useSalesSeriesByChannel } from '@pages/Reports/hooks/useSalesSeriesByChannel/useSalesSeriesByChannel'
import { useSalesSeriesByPaymentMethod } from '@pages/Reports/hooks/useSalesSeriesByPaymentMethod/useSalesSeriesByPaymentMethod'
import { useTimingReport } from '@pages/Reports/hooks/useTimingReport/useTimingReport'
import { dateToInput, parseInputDate, todayInput } from '@pages/Reports/utils/date-input'
import { CHANNEL_LABEL, PAYMENT_METHOD_LABEL } from '@shared/constants/order.constants'
import { useSalesReport } from '@shared/hooks/order/useSalesReport/useSalesReport'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type { PeriodChoice } from '@shared/types/ui/period-choice'

export const useReportsFacade = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('periodo')
  const period: PeriodChoice = REPORTS_PERIODS.some(({ id }) => id === requested)
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
  const requestTenant = range ? tenantId : null
  const reportQuery = useSalesReport(requestTenant, requestRange)
  const timingQuery = useTimingReport(requestTenant, requestRange)
  const channelQuery = useSalesSeriesByChannel(requestTenant, requestRange)
  const paymentQuery = useSalesSeriesByPaymentMethod(requestTenant, requestRange)

  const setPeriod = (next: PeriodChoice) =>
    setSearchParams((current) => {
      const params = new URLSearchParams(current)
      params.set('periodo', next)
      return params
    }, { replace: true })

  return {
    range: requestRange,
    period,
    setPeriod,
    custom: {
      from: customFrom,
      to: customTo,
      setFrom: (date: Date | undefined) => setCustomFrom(date ? dateToInput(date) : ''),
      setTo: (date: Date | undefined) => setCustomTo(date ? dateToInput(date) : ''),
      fromDate: customFrom ? parseInputDate(customFrom) : undefined,
      toDate: customTo ? parseInputDate(customTo) : undefined,
      fromEndMonth: parseInputDate(customTo || todayInput()),
      toStartMonth: customFrom ? parseInputDate(customFrom) : undefined,
      toEndMonth: parseInputDate(todayInput()),
      awaitingDates,
    },
    report: reportQuery,
    timing: timingQuery,
    series: {
      channel: channelQuery,
      payment: paymentQuery,
    },
    breakdown: {
      channel: toChannelBreakdownItems(reportQuery.report?.byChannel ?? [], (channel) => CHANNEL_LABEL[channel]),
      payment: toPaymentMethodBreakdownItems(reportQuery.report?.byPaymentMethod ?? [], (method) => PAYMENT_METHOD_LABEL[method]),
    },
    tenantId,
    labels: { channel: CHANNEL_LABEL, payment: PAYMENT_METHOD_LABEL },
  }
}
