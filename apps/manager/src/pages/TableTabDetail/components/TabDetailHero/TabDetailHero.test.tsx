import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TabDetailHero } from './TabDetailHero'
import { tabDetailHeroMock } from './TabDetailHero.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)

const mockTab = (tab: unknown) =>
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    tab,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)

describe('TabDetailHero', () => {
  it('names the tab with its status, item count and total', () => {
    mockTab(tabDetailHeroMock.openTab)

    render(<TabDetailHero />)

    expect(screen.getByRole('heading', { name: 'Mesa 4' })).toBeInTheDocument()
    expect(screen.getByText('Aberta')).toBeInTheDocument()
    expect(screen.getByText('1 item na conta')).toBeInTheDocument()
    expect(screen.getByText('R$ 36,00')).toBeInTheDocument()
  })

  it('pluralizes the item count', () => {
    mockTab(tabDetailHeroMock.pluralTab)

    render(<TabDetailHero />)

    expect(screen.getByText('2 itens na conta')).toBeInTheDocument()
  })

  it('flags a tab that waits for payment', () => {
    mockTab(tabDetailHeroMock.awaitingPaymentTab)

    render(<TabDetailHero />)

    expect(screen.getByText('Aguardando pagamento')).toBeInTheDocument()
  })

  it('renders nothing while the tab is unknown', () => {
    mockTab(undefined)

    const { container } = render(<TabDetailHero />)

    expect(container).toBeEmptyDOMElement()
  })
})
