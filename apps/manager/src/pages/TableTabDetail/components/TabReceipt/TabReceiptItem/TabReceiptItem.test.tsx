import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TabReceiptItem } from './TabReceiptItem'
import {
  tabReceiptActiveItemMock,
  tabReceiptCancelledItemMock,
} from './TabReceiptItem.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)

const mockFacade = (isCancellingItem = false) => {
  const submitCancelItem = vi.fn()
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    submitCancelItem,
    isCancellingItem,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)
  return submitCancelItem
}

describe('TabReceiptItem', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the item with quantity, modifiers, notes and line total', () => {
    mockFacade()

    render(<TabReceiptItem item={tabReceiptActiveItemMock} canCancel />)

    expect(screen.getByText('Pastel de queijo')).toBeInTheDocument()
    expect(screen.getByText('2 × R$ 18,00')).toBeInTheDocument()
    expect(screen.getByText('+ Bacon')).toBeInTheDocument()
    expect(screen.getByText('+ Catupiry × 2')).toBeInTheDocument()
    expect(screen.getByText('bem passado')).toBeInTheDocument()
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument()
  })

  it('cancels the item after confirming', async () => {
    const submitCancelItem = mockFacade()
    render(<TabReceiptItem item={tabReceiptActiveItemMock} canCancel />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar item' }))
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Cancelar item',
      })
    )

    expect(submitCancelItem).toHaveBeenCalledWith('item-1')
  })

  it('keeps the item when the confirmation is declined', async () => {
    const submitCancelItem = mockFacade()
    render(<TabReceiptItem item={tabReceiptActiveItemMock} canCancel />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar item' }))
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(submitCancelItem).not.toHaveBeenCalled()
  })

  it('closes the confirmation when it is dismissed from outside', async () => {
    mockFacade()
    render(<TabReceiptItem item={tabReceiptActiveItemMock} canCancel />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar item' }))
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Cancelar este item?' })
      ).not.toBeInTheDocument()
    )
  })

  it('offers no cancellation when the tab no longer accepts it', () => {
    mockFacade()

    render(<TabReceiptItem item={tabReceiptActiveItemMock} canCancel={false} />)

    expect(
      screen.queryByRole('button', { name: 'Cancelar item' })
    ).not.toBeInTheDocument()
  })

  it('marks a cancelled item and offers no second cancellation', () => {
    mockFacade()

    render(<TabReceiptItem item={tabReceiptCancelledItemMock} canCancel />)

    expect(screen.getByText('Item cancelado')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Cancelar item' })
    ).not.toBeInTheDocument()
  })
})
