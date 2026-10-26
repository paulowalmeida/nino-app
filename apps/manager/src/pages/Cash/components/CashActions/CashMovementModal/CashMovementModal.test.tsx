import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '../../../facades/useCashFacade/useCashFacade'
import { CashMovementModal } from './CashMovementModal'
import {
  cashMovementReasonMock,
  cashMovementTypedMock,
} from './CashMovementModal.mock'

vi.mock('../../../facades/useCashFacade/useCashFacade')

const submitMovement = vi.fn()
const onClose = vi.fn()

describe(CashMovementModal.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCashFacade).mockReturnValue({
      submitMovement,
      isMoving: false,
    } as unknown as ReturnType<typeof useCashFacade>)
  })

  it('speaks of a withdrawal when money leaves the drawer', () => {
    render(<CashMovementModal open kind="WITHDRAWAL" onClose={onClose} />)

    expect(
      screen.getByRole('heading', { name: 'Registrar sangria' })
    ).toBeInTheDocument()
  })

  it('speaks of a deposit when money goes into the drawer', () => {
    render(<CashMovementModal open kind="DEPOSIT" onClose={onClose} />)

    expect(
      screen.getByRole('heading', { name: 'Registrar suprimento' })
    ).toBeInTheDocument()
  })

  it('stays shut until a movement is asked for', () => {
    render(
      <CashMovementModal open={false} kind="WITHDRAWAL" onClose={onClose} />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('records the amount and the reason that were typed', async () => {
    // Arrange
    render(<CashMovementModal open kind="WITHDRAWAL" onClose={onClose} />)

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Valor' }),
      cashMovementTypedMock
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Motivo' }),
      cashMovementReasonMock
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Registrar sangria' })
    )

    // Assert
    expect(submitMovement).toHaveBeenCalledWith({
      kind: 'WITHDRAWAL',
      amount: 30,
      reason: cashMovementReasonMock,
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('leaves the reason out when nobody wrote one', async () => {
    // Arrange
    render(<CashMovementModal open kind="DEPOSIT" onClose={onClose} />)

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Valor' }),
      cashMovementTypedMock
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Registrar suprimento' })
    )

    // Assert
    expect(submitMovement).toHaveBeenCalledWith({
      kind: 'DEPOSIT',
      amount: 30,
      reason: undefined,
    })
  })

  it('refuses to record a movement worth nothing', () => {
    render(<CashMovementModal open kind="WITHDRAWAL" onClose={onClose} />)

    expect(
      screen.getByRole('button', { name: 'Registrar sangria' })
    ).toBeDisabled()
  })

  it('closes when the modal itself is dismissed', async () => {
    render(<CashMovementModal open kind="DEPOSIT" onClose={onClose} />)

    await userEvent.click(screen.getByRole('textbox', { name: 'Valor' }))
    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })

  it('closes without recording anything on cancel', async () => {
    render(<CashMovementModal open kind="WITHDRAWAL" onClose={onClose} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(submitMovement).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
