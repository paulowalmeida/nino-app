import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useReportsFacade } from '@pages/Reports/facades/useReportsFacade/useReportsFacade'

import { ReportsNotice } from './ReportsNotice'
import { reportsNoticeMock } from './ReportsNotice.mock'

vi.mock('@pages/Reports/facades/useReportsFacade/useReportsFacade')

const renderWithStatus = (status: string) => {
  vi.mocked(useReportsFacade).mockReturnValue({
    status,
  } as unknown as ReturnType<typeof useReportsFacade>)
  return render(<ReportsNotice />)
}

describe('ReportsNotice', () => {
  it('asks for the dates of a custom period', () => {
    renderWithStatus('awaiting-dates')

    expect(
      screen.getByText(reportsNoticeMock.awaitingDates)
    ).toBeInTheDocument()
  })

  it('explains why the report could not be built', () => {
    renderWithStatus('error')

    expect(screen.getByText(reportsNoticeMock.errorTitle)).toBeInTheDocument()
    expect(screen.getByText(reportsNoticeMock.errorMessage)).toBeInTheDocument()
  })

  it('says when the period has no completed sale', () => {
    renderWithStatus('empty')

    expect(screen.getByText(reportsNoticeMock.empty)).toBeInTheDocument()
  })

  it.each(['pending', 'ready'])('stays out of the way while %s', (status) => {
    const { container } = renderWithStatus(status)

    expect(container).toBeEmptyDOMElement()
  })
})
