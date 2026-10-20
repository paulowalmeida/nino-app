import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TabPaymentList } from './TabPaymentList'
import { tabPaymentListMock } from './TabPaymentList.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)

const mockTab = (tab: unknown) =>
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    tab,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)

describe('TabPaymentList', () => {
  it('lists each part of a split bill with its method, moment and change', () => {
    mockTab(tabPaymentListMock.splitTab)

    render(<TabPaymentList />)

    const rows = within(
      screen.getByRole('list', { name: 'Pagamentos registrados' })
    ).getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    expect(within(rows[0]).getByText('Dinheiro')).toBeInTheDocument()
    expect(within(rows[0]).getByText('R$ 20,00')).toBeInTheDocument()
    expect(within(rows[0]).getByText('Troco de R$ 5,00')).toBeInTheDocument()
    expect(
      within(rows[1]).getByText('Cartão na maquininha')
    ).toBeInTheDocument()
    expect(within(rows[1]).getByText('19/10/2026, 10:10')).toBeInTheDocument()
    expect(within(rows[1]).queryByText(/Troco/)).not.toBeInTheDocument()
  })

  it('renders nothing before the first payment', () => {
    mockTab(tabPaymentListMock.unpaidTab)

    const { container } = render(<TabPaymentList />)

    expect(container).toBeEmptyDOMElement()
  })
})
