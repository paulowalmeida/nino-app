import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '../../../facades/useCashFacade/useCashFacade'
import { CashCloseModal } from './CashCloseModal'
import {
  cashCloseModalMock,
  cashCloseSessionMock,
  cashCountedTypedMock,
} from './CashCloseModal.mock'

vi.mock('../../../facades/useCashFacade/useCashFacade')

const submitClose = vi.fn()
const onClose = vi.fn()

const facadeWith = (session: unknown) =>
  vi.mocked(useCashFacade).mockReturnValue({
    session,
    submitClose,
    isClosing: false,
  } as unknown as ReturnType<typeof useCashFacade>)

describe(CashCloseModal.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    facadeWith(cashCloseSessionMock)
  })

  it('renders nothing while there is no session', () => {
    facadeWith(null)

    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('states what the drawer is expected to hold', () => {
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    expect(screen.getByText(/R\$ 180,00/)).toBeInTheDocument()
  })

  it('shows the gap between counted and expected while typing', async () => {
    // Arrange
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Dinheiro contado' }),
      cashCountedTypedMock
    )

    // Assert
    expect(screen.getByText('Diferença')).toBeInTheDocument()
    expect(screen.getByText(/R\$\s?5,00/)).toBeInTheDocument()
  })

  it('closes the drawer with what was actually counted', async () => {
    // Arrange
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Dinheiro contado' }),
      cashCountedTypedMock
    )
    await userEvent.click(screen.getByRole('button', { name: 'Fechar caixa' }))

    // Assert
    expect(submitClose).toHaveBeenCalledWith({
      countedAmount: 175,
      closingNote: undefined,
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('refuses to close before anyone counts the drawer', () => {
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    expect(screen.getByRole('button', { name: 'Fechar caixa' })).toBeDisabled()
  })

  it('stays shut until the closing is asked for', () => {
    render(
      <CashCloseModal {...cashCloseModalMock} open={false} onClose={onClose} />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows no gap when the count matches the expectation', async () => {
    // Arrange
    facadeWith({ ...cashCloseSessionMock, expectedAmount: 175 })
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Dinheiro contado' }),
      cashCountedTypedMock
    )

    // Assert
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument()
  })

  it('signs a surplus with a plus', async () => {
    // Arrange
    facadeWith({ ...cashCloseSessionMock, expectedAmount: 100 })
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Dinheiro contado' }),
      cashCountedTypedMock
    )

    // Assert
    expect(screen.getByText(/^\+/)).toHaveTextContent('R$ 75,00')
  })

  it('keeps the closing note that was written', async () => {
    // Arrange
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Dinheiro contado' }),
      cashCountedTypedMock
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Observação do fechamento' }),
      'Faltou troco'
    )
    await userEvent.click(screen.getByRole('button', { name: 'Fechar caixa' }))

    // Assert
    expect(submitClose).toHaveBeenCalledWith({
      countedAmount: 175,
      closingNote: 'Faltou troco',
    })
  })

  it('closes when the modal itself is dismissed', async () => {
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    await userEvent.click(
      screen.getByRole('textbox', { name: 'Dinheiro contado' })
    )
    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })

  it('closes without counting anything on cancel', async () => {
    render(<CashCloseModal {...cashCloseModalMock} onClose={onClose} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(submitClose).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
