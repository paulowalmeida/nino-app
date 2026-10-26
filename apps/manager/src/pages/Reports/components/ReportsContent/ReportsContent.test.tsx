import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useReportsFacade } from '@pages/Reports/facades/useReportsFacade/useReportsFacade'

import { ReportsContent } from './ReportsContent'
import { reportsContentMock } from './ReportsContent.mock'

vi.mock('@pages/Reports/facades/useReportsFacade/useReportsFacade')
vi.mock('@pages/Reports/components/SalesFiguresGrid/SalesFiguresGrid', () => ({
  SalesFiguresGrid: ({ report }: { report: { orderCount: number } }) => (
    <div>figures:{report.orderCount}</div>
  ),
}))
vi.mock('@pages/Reports/components/SalesPeriodTrend/SalesPeriodTrend', () => ({
  SalesPeriodTrend: () => <div>period-trend</div>,
}))
vi.mock(
  '@pages/Reports/components/SalesTrendByDimension/SalesTrendByDimension',
  () => ({
    SalesTrendByDimension: ({
      title,
      labelOf,
    }: {
      title: string
      labelOf: (key: string) => string
    }) => (
      <div>
        {title}:{labelOf(title.includes('canal') ? 'DELIVERY' : 'PIX')}
      </div>
    ),
  })
)
vi.mock(
  '@pages/Reports/components/TimingFiguresGrid/TimingFiguresGrid',
  () => ({
    TimingFiguresGrid: () => <div>timing</div>,
  })
)
vi.mock('@pages/Reports/components/SalesBreakdown/SalesBreakdown', () => ({
  SalesBreakdown: ({ title }: { title: string }) => (
    <div>breakdown:{title}</div>
  ),
}))
vi.mock('@pages/Reports/components/TopSalesTable/TopSalesTable', () => ({
  TopSalesTable: ({ products }: { products: unknown[] }) => (
    <div>top:{products.length}</div>
  ),
}))

const mockFacade = (overrides: Record<string, unknown> = {}) =>
  vi.mocked(useReportsFacade).mockReturnValue({
    report: { report: reportsContentMock.report },
    timing: { report: reportsContentMock.timing },
    trend: { series: reportsContentMock.trend },
    series: {
      channel: { breakdown: reportsContentMock.channelBreakdown },
      payment: { breakdown: reportsContentMock.paymentBreakdown },
    },
    breakdown: {
      channel: reportsContentMock.channelItems,
      payment: reportsContentMock.paymentItems,
    },
    labels: reportsContentMock.labels,
    ...overrides,
  } as unknown as ReturnType<typeof useReportsFacade>)

describe('ReportsContent', () => {
  it('composes every loaded region of the report', () => {
    mockFacade()

    render(<ReportsContent />)

    expect(screen.getByText('figures:4')).toBeInTheDocument()
    expect(screen.getByText('period-trend')).toBeInTheDocument()
    expect(
      screen.getByText('Faturamento por canal:Delivery')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Faturamento por forma de pagamento:Pix')
    ).toBeInTheDocument()
    expect(screen.getByText('timing')).toBeInTheDocument()
    expect(screen.getByText('breakdown:Por canal')).toBeInTheDocument()
    expect(
      screen.getByText('breakdown:Por forma de pagamento')
    ).toBeInTheDocument()
    expect(screen.getByText('top:1')).toBeInTheDocument()
  })

  it.each([
    ['report', { report: { report: undefined } }],
    ['timing', { timing: { report: undefined } }],
    ['trend', { trend: { series: undefined } }],
    [
      'channel series',
      {
        series: {
          channel: { breakdown: undefined },
          payment: { breakdown: reportsContentMock.paymentBreakdown },
        },
      },
    ],
    [
      'payment series',
      {
        series: {
          channel: { breakdown: reportsContentMock.channelBreakdown },
          payment: { breakdown: undefined },
        },
      },
    ],
  ])('renders nothing while the %s is missing', (_part, overrides) => {
    mockFacade(overrides)

    const { container } = render(<ReportsContent />)

    expect(container).toBeEmptyDOMElement()
  })
})
