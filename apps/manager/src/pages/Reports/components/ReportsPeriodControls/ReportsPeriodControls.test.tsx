import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useReportsFacade } from '@pages/Reports/facades/useReportsFacade/useReportsFacade'

import { ReportsPeriodControls } from './ReportsPeriodControls'
import { reportsPeriodControlsMock } from './ReportsPeriodControls.mock'

vi.mock('@pages/Reports/facades/useReportsFacade/useReportsFacade')

const mockFacade = (period: string) => {
  const setPeriod = vi.fn()
  vi.mocked(useReportsFacade).mockReturnValue({
    period,
    setPeriod,
    custom: {
      ...reportsPeriodControlsMock.custom,
      setFrom: vi.fn(),
      setTo: vi.fn(),
    },
  } as unknown as ReturnType<typeof useReportsFacade>)
  return setPeriod
}

describe('ReportsPeriodControls', () => {
  it('selects the current period and changes it on click', async () => {
    const setPeriod = mockFacade('today')
    render(<ReportsPeriodControls />)

    expect(screen.getByRole('tab', { name: 'Hoje' })).toHaveAttribute(
      'aria-selected',
      'true'
    )

    await userEvent.click(screen.getByRole('tab', { name: '7 dias' }))

    expect(setPeriod).toHaveBeenCalledWith('week')
  })

  it('offers the date range only for a custom period', () => {
    mockFacade('today')
    const { unmount } = render(<ReportsPeriodControls />)
    expect(screen.queryByText('De')).not.toBeInTheDocument()
    unmount()

    mockFacade('custom')
    render(<ReportsPeriodControls />)

    expect(screen.getByText('De')).toBeInTheDocument()
    expect(screen.getByText('Até')).toBeInTheDocument()
  })
})
