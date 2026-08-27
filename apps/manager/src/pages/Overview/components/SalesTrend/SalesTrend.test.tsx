import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { SalesTrend } from './SalesTrend'
import { salesTrendMock } from './SalesTrend.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')
vi.mock('@shared/components/SalesChart/SalesChart', () => ({ SalesChart: () => <div>chart</div> }))
vi.mock('@shared/skeletons/SalesTrendSkeleton/SalesTrendSkeleton', () => ({ SalesTrendSkeleton: () => <div>chart loading</div> }))

describe('SalesTrend', () => {
  it('renders the loading sales state', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      salesSeries: { series: undefined, isPending: true },
    } as never)

    render(<SalesTrend />)

    expect(screen.getByLabelText(salesTrendMock.label)).toBeInTheDocument()
    expect(screen.getByText('chart loading')).toBeInTheDocument()
  })

  it('renders the empty sales state', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      salesSeries: { series: { points: [] }, isPending: false },
    } as never)

    render(<SalesTrend />)

    expect(screen.getByText(/Nenhuma venda concluída/)).toBeInTheDocument()
  })

  it('renders a positive sales variation and chart', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      salesSeries: {
        series: {
          granularity: 'day',
          points: [
            { at: '2026-08-25T12:00:00.000Z', revenue: 10, orderCount: 1 },
            { at: '2026-08-26T12:00:00.000Z', revenue: 20, orderCount: 2 },
          ],
        },
        isPending: false,
      },
    } as never)

    render(<SalesTrend />)

    expect(screen.getByText('+100%')).toBeInTheDocument()
    expect(screen.getByText('chart')).toBeInTheDocument()
  })

  it('does not calculate variation after a zero day', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      salesSeries: {
        series: {
          granularity: 'day',
          points: [
            { at: '2026-08-25T12:00:00.000Z', revenue: 0, orderCount: 0 },
            { at: '2026-08-26T12:00:00.000Z', revenue: 20, orderCount: 2 },
          ],
        },
        isPending: false,
      },
    } as never)

    render(<SalesTrend />)

    expect(screen.queryByText(/vs\. ontem/)).not.toBeInTheDocument()
  })

  it('renders a negative sales variation', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      salesSeries: {
        series: {
          granularity: 'day',
          points: [
            { at: '2026-08-25T12:00:00.000Z', revenue: 20, orderCount: 2 },
            { at: '2026-08-26T12:00:00.000Z', revenue: 10, orderCount: 1 },
          ],
        },
        isPending: false,
      },
    } as never)

    render(<SalesTrend />)

    expect(screen.getByText('-50%')).toBeInTheDocument()
  })
})
