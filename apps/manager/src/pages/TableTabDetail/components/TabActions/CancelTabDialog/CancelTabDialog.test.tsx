import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { CancelTabDialog } from './CancelTabDialog'
import { cancelTabDialogMock } from './CancelTabDialog.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)

const mockFacade = (isCancelling = false) => {
  const submitCancel = vi.fn()
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    submitCancel,
    isCancelling,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)
  return submitCancel
}

describe('CancelTabDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('keeps the confirm action disabled until a reason is typed', async () => {
    mockFacade()
    render(<CancelTabDialog open onClose={vi.fn()} />)

    const confirm = screen.getByRole('button', { name: 'Cancelar comanda' })
    expect(confirm).toBeDisabled()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Motivo do cancelamento' }),
      cancelTabDialogMock.reason
    )

    expect(confirm).toBeEnabled()
  })

  it('cancels with the trimmed reason, then closes', async () => {
    const submitCancel = mockFacade()
    submitCancel.mockImplementation((_request, options) => options.onSuccess())
    const onClose = vi.fn()
    render(<CancelTabDialog open onClose={onClose} />)

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Motivo do cancelamento' }),
      cancelTabDialogMock.paddedReason
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Cancelar comanda' })
    )

    expect(submitCancel).toHaveBeenCalledWith(
      { cancelReason: cancelTabDialogMock.reason },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('does not submit a blank reason', async () => {
    const submitCancel = mockFacade()
    render(<CancelTabDialog open onClose={vi.fn()} />)

    const reasonField = screen.getByRole('textbox', {
      name: 'Motivo do cancelamento',
    })
    await userEvent.type(reasonField, '   ')
    fireEvent.submit(reasonField.closest('form') as HTMLFormElement)

    expect(submitCancel).not.toHaveBeenCalled()
  })

  it('closes without cancelling when the person goes back or dismisses', async () => {
    const submitCancel = mockFacade()
    const onClose = vi.fn()
    render(<CancelTabDialog open onClose={onClose} />)

    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledTimes(2)
    expect(submitCancel).not.toHaveBeenCalled()
  })

  it('shows the loading state on the confirm action while cancelling', () => {
    mockFacade(true)
    render(<CancelTabDialog open onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Carregando/ })).toHaveAttribute(
      'aria-busy',
      'true'
    )
  })
})
