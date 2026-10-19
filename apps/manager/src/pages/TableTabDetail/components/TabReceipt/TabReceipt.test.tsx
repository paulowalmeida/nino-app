import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TabReceipt } from './TabReceipt'
import { tabReceiptMock } from './TabReceipt.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)
vi.mock(
  '@pages/TableTabDetail/components/TabReceipt/TabReceiptItem/TabReceiptItem',
  () => ({
    TabReceiptItem: ({
      item,
      canCancel,
    }: {
      item: { productName: string }
      canCancel: boolean
    }) => (
      <li>
        {item.productName} {canCancel ? 'cancelável' : 'travado'}
      </li>
    ),
  })
)
vi.mock(
  '@pages/TableTabDetail/components/TabReceipt/AddTabItemDialog/AddTabItemDialog',
  () => ({
    AddTabItemDialog: ({
      open,
      onClose,
    }: {
      open: boolean
      onClose: () => void
    }) =>
      open ? (
        <button type="button" onClick={onClose}>
          fechar lançamento
        </button>
      ) : null,
  })
)

const mockTab = (tab: unknown) =>
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    tab,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)

describe('TabReceipt', () => {
  it('lists every item, cancelled ones included, with the total', () => {
    mockTab(tabReceiptMock.openTab)

    render(<TabReceipt />)

    expect(screen.getByText('Pastel de queijo cancelável')).toBeInTheDocument()
    expect(screen.getByText('Caldo de cana cancelável')).toBeInTheDocument()
    expect(screen.getByText('R$ 36,00')).toBeInTheDocument()
  })

  it('opens and closes the item launch while the tab is open', async () => {
    mockTab(tabReceiptMock.openTab)
    render(<TabReceipt />)

    await userEvent.click(screen.getByRole('button', { name: 'Lançar item' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'fechar lançamento' })
    )

    expect(
      screen.queryByRole('button', { name: 'fechar lançamento' })
    ).not.toBeInTheDocument()
  })

  it('freezes the items once the tab is closed', () => {
    mockTab(tabReceiptMock.awaitingPaymentTab)

    render(<TabReceipt />)

    expect(screen.getByText('Pastel de queijo travado')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Lançar item' })
    ).not.toBeInTheDocument()
  })

  it('invites the first launch on an empty tab', () => {
    mockTab(tabReceiptMock.emptyTab)

    render(<TabReceipt />)

    expect(screen.getByText('Nenhum item lançado ainda.')).toBeInTheDocument()
  })

  it('renders nothing while the tab is unknown', () => {
    mockTab(undefined)

    const { container } = render(<TabReceipt />)

    expect(container).toBeEmptyDOMElement()
  })
})
