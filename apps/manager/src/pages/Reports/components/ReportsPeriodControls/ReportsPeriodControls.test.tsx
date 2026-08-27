import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ReportsPeriodControls } from './ReportsPeriodControls'

describe('ReportsPeriodControls', () => {
  it('renders the period navigation', () => {
    render(<ReportsPeriodControls period="today" onPeriodChange={() => undefined} custom={{ awaitingDates: false, fromEndMonth: new Date(), toEndMonth: new Date(), setFrom: () => undefined, setTo: () => undefined }} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })
})
