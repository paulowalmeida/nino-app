import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Overview } from './Overview'
import { overviewMock } from './Overview.mock'

vi.mock('@pages/Overview/components/DayTally/DayTally', () => ({ DayTally: () => <div>day tally</div> }))
vi.mock('@pages/Overview/components/OverviewHeader/OverviewHeader', () => ({ OverviewHeader: () => <h1>{overviewMock.title}</h1> }))
vi.mock('@pages/Overview/components/PauseSwitch/PauseSwitch', () => ({ PauseSwitch: () => <div>pause</div> }))
vi.mock('@pages/Overview/components/QueueBoard/QueueBoard', () => ({ QueueBoard: () => <div>queue</div> }))
vi.mock('@pages/Overview/components/SalesTrend/SalesTrend', () => ({ SalesTrend: () => <div>sales trend</div> }))
vi.mock('@pages/Overview/components/TopCustomers/TopCustomers', () => ({ TopCustomers: () => <div>customers</div> }))
vi.mock('@pages/Overview/components/TopProducts/TopProducts', () => ({ TopProducts: () => <div>products</div> }))

describe('Overview', () => {
  it('composes the overview regions', () => {
    render(<Overview />)

    expect(screen.getByRole('heading', { name: overviewMock.title })).toBeInTheDocument()
    expect(screen.getByText('day tally')).toBeInTheDocument()
    expect(screen.getByText('pause')).toBeInTheDocument()
    expect(screen.getByText('queue')).toBeInTheDocument()
  })
})
