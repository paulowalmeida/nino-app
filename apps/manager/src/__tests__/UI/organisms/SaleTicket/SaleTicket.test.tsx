import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SaleTicket } from '@organisms/SaleTicket/SaleTicket'
import type { SaleTicketProps } from '@organisms/SaleTicket/SaleTicket'

import { coxinhaLine, twoCoxinhaLine } from './SaleTicket.mock'

const renderTicket = (props: Partial<SaleTicketProps> = {}) =>
  render(
    <SaleTicket
      lines={[]}
      customerName=""
      tableNumber=""
      onCustomerName={vi.fn()}
      onTableNumber={vi.fn()}
      methods={['CASH']}
      method="CASH"
      isSending={false}
      error={null}
      onStep={vi.fn()}
      onMethod={vi.fn()}
      onClear={vi.fn()}
      onFinish={vi.fn()}
      {...props}
    />
  )

describe(SaleTicket.name, () => {
  it('shows the empty prompt with no lines in the sale', () => {
    // Arrange / Act
    renderTicket()

    // Assert
    expect(
      screen.getByText('Toque nos itens para montar a venda.')
    ).toBeInTheDocument()
  })

  it('lists each line with its running total', () => {
    // Arrange / Act
    renderTicket({ lines: [twoCoxinhaLine] })

    // Assert
    expect(screen.getByText('Coxinha')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 17,00')).toHaveLength(2)
  })

  it('disables finish while there are no lines to close', () => {
    // Arrange / Act
    renderTicket({ lines: [] })

    // Assert
    expect(
      screen.getByRole('button', { name: 'Fechar venda' })
    ).toBeDisabled()
  })

  it('calls onStep to add one more unit', async () => {
    // Arrange
    const user = userEvent.setup()
    const onStep = vi.fn()
    renderTicket({ lines: [coxinhaLine], onStep })

    // Act
    await user.click(screen.getByLabelText('Mais um Coxinha'))

    // Assert
    expect(onStep).toHaveBeenCalledWith('item-1', 1)
  })

  it('asks for confirmation before clearing the sale', async () => {
    // Arrange
    const user = userEvent.setup()
    const onClear = vi.fn()
    renderTicket({ lines: [coxinhaLine], onClear })

    // Act
    await user.click(screen.getByRole('button', { name: 'Limpar comanda' }))

    // Assert
    expect(onClear).not.toHaveBeenCalled()
    expect(
      screen.getByRole('heading', { name: 'Limpar a comanda?' })
    ).toBeInTheDocument()

    // Act
    await user.click(screen.getByRole('button', { name: 'Limpar' }))

    // Assert
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('shows the error alert when the sale fails to close', () => {
    // Arrange / Act
    renderTicket({ lines: [coxinhaLine], error: 'Falha ao fechar a venda' })

    // Assert
    expect(screen.getByText('Falha ao fechar a venda')).toBeInTheDocument()
  })
})
