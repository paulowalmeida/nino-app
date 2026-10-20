import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'
import { kitchenCardOrderMock } from '@shared/components/KitchenCard/KitchenCard.mock'

import { DayTally } from './DayTally'
import { dayTallyMock } from './DayTally.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')
vi.mock('./TallyCard/TallyCard', () => ({
  TallyCard: () => <div>tally card</div>,
}))
vi.mock('./TallyHistory/TallyHistory', () => ({
  TallyHistory: () => <div>history</div>,
}))
vi.mock('./DayTallySkeleton/DayTallySkeleton', () => ({
  DayTallySkeleton: () => <div>tally loading</div>,
}))

describe('DayTally', () => {
  it('renders the loading tally state', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      timezone: dayTallyMock.timezone,
      orders: { orders: [], isPending: true },
    } as never)

    render(<DayTally />)

    expect(screen.getByText('tally loading')).toBeInTheDocument()
  })

  it('renders payment and recent order sections', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      timezone: dayTallyMock.timezone,
      orders: {
        orders: [
          { ...kitchenCardOrderMock, createdAt: new Date().toISOString() },
        ],
        isPending: false,
      },
    } as never)

    render(<DayTally />)

    expect(screen.getByText('Por forma de pagamento')).toBeInTheDocument()
    expect(screen.getByText('history')).toBeInTheDocument()
  })

  it('falls back to the browser timezone', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      timezone: null,
      orders: { orders: [], isPending: false },
    } as never)

    render(<DayTally />)

    expect(screen.getByText('O dia até agora')).toBeInTheDocument()
  })
})
