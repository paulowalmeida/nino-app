import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UnitHours } from './UnitHours'

vi.mock('@pages/Units/facades/useUnitHoursFacade/useUnitHoursFacade', () => ({
  useUnitHoursFacade: () => ({
    query: { hours: [], isPending: false },
    save: { mutateAsync: vi.fn(), isPending: false },
  }),
}))
vi.mock('@pages/Units/components/WeekSchedule/WeekSchedule', () => ({
  WeekSchedule: () => <div>hours settings</div>,
}))

describe(UnitHours.name, () => {
  it('renders the week schedule of the current unit', () => {
    render(<UnitHours />)
    expect(screen.getByText('hours settings')).toBeInTheDocument()
  })
})
