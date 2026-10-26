import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { OverviewHeader } from './OverviewHeader'
import { overviewHeaderMock } from './OverviewHeader.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')
vi.mock('./StoreSign/StoreSign', () => ({
  StoreSign: () => <span>store sign</span>,
}))

describe('OverviewHeader', () => {
  it('renders the unit identity and greeting', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      firstName: overviewHeaderMock.firstName,
      timezone: overviewHeaderMock.timezone,
      unit: { unitName: 'Minha loja', unitSlug: 'minha-loja' },
      storeOpen: { isOpen: true },
    } as never)

    render(<OverviewHeader />)

    expect(
      screen.getByRole('heading', { name: 'Minha loja' })
    ).toBeInTheDocument()
    expect(screen.getByText('store sign')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver a loja/ })).toHaveAttribute(
      'href',
      'http://localhost:3002/minha-loja'
    )
  })

  it('renders the fallback identity without a unit', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      firstName: '',
      timezone: null,
      unit: null,
      storeOpen: { isOpen: false },
    } as never)

    render(<OverviewHeader />)

    expect(
      screen.getByRole('heading', { name: 'Sua loja' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /Ver a loja/ })
    ).not.toBeInTheDocument()
  })
})
