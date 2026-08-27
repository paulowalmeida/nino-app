import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Reports } from './Reports'

vi.mock('./facades/useReportsFacade/useReportsFacade', () => ({
  useReportsFacade: () => ({
    period: 'today', setPeriod: vi.fn(), custom: { awaitingDates: false }, tenantId: null,
    report: { report: undefined, isPending: false, isError: false, range: { period: 'today' } },
    timing: { report: undefined, isPending: false },
    series: { channel: { breakdown: [], isPending: false }, payment: { breakdown: [], isPending: false } },
    breakdown: { channel: [], payment: [] }, labels: { channel: {}, payment: {} },
  }),
}))
vi.mock('./components/SalesBreakdown/SalesBreakdown', () => ({ SalesBreakdown: () => <div /> }))
vi.mock('./components/SalesFiguresGrid/SalesFiguresGrid', () => ({ SalesFiguresGrid: () => <div /> }))
vi.mock('./components/SalesPeriodTrend/SalesPeriodTrend', () => ({ SalesPeriodTrend: () => <div /> }))
vi.mock('./components/SalesTrendByDimension/SalesTrendByDimension', () => ({ SalesTrendByDimension: () => <div /> }))
vi.mock('./components/TimingFiguresGrid/TimingFiguresGrid', () => ({ TimingFiguresGrid: () => <div /> }))
vi.mock('./components/TopSalesTable/TopSalesTable', () => ({ TopSalesTable: () => <div /> }))

describe('Reports', () => {
  it('governs the reports screen through domain regions', () => {
    render(<Reports />)
    expect(screen.getByRole('heading', { name: /Relatório de venda/ })).toBeInTheDocument()
  })
})
