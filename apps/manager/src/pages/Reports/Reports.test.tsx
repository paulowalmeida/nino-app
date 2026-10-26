import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useReportsFacade } from '@pages/Reports/facades/useReportsFacade/useReportsFacade'

import { Reports } from './Reports'
import { reportsPageMock } from './Reports.mock'

vi.mock('@pages/Reports/facades/useReportsFacade/useReportsFacade')
vi.mock(
  '@pages/Reports/components/ReportsPeriodControls/ReportsPeriodControls',
  () => ({
    ReportsPeriodControls: () => <div>reports-period-controls</div>,
  })
)
vi.mock('@pages/Reports/components/ReportsContent/ReportsContent', () => ({
  ReportsContent: () => <div>reports-content</div>,
}))
vi.mock('@pages/Reports/components/ReportsNotice/ReportsNotice', () => ({
  ReportsNotice: () => <div>reports-notice</div>,
}))
vi.mock('@pages/Reports/skeletons/ReportsSkeleton/ReportsSkeleton', () => ({
  ReportsSkeleton: () => <div>reports-skeleton</div>,
}))

const renderWithStatus = (status: string) => {
  vi.mocked(useReportsFacade).mockReturnValue({
    status,
  } as unknown as ReturnType<typeof useReportsFacade>)
  return render(<Reports />)
}

describe('Reports', () => {
  it('always keeps the title and the period controls', () => {
    renderWithStatus('pending')

    expect(
      screen.getByRole('heading', { name: reportsPageMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText('reports-period-controls')).toBeInTheDocument()
  })

  it('shows only the skeleton while the report loads', () => {
    renderWithStatus('pending')

    expect(screen.getByText(reportsPageMock.skeleton)).toBeInTheDocument()
    expect(screen.queryByText(reportsPageMock.content)).not.toBeInTheDocument()
  })

  it('shows the content only when everything is ready', () => {
    renderWithStatus('ready')

    expect(screen.getByText(reportsPageMock.content)).toBeInTheDocument()
    expect(screen.queryByText(reportsPageMock.skeleton)).not.toBeInTheDocument()
  })

  it.each(['awaiting-dates', 'error', 'empty'])(
    'hands the %s state to the notice, with neither skeleton nor content',
    (status) => {
      renderWithStatus(status)

      expect(screen.getByText(reportsPageMock.notice)).toBeInTheDocument()
      expect(
        screen.queryByText(reportsPageMock.skeleton)
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(reportsPageMock.content)
      ).not.toBeInTheDocument()
    }
  )
})
