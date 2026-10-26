import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PositionRemoveDialog } from './PositionRemoveDialog'
import { positionRemoveDialogMock } from './PositionRemoveDialog.mock'

const onConfirm = vi.fn()
const onClose = vi.fn()

const renderDialog = () =>
  render(
    <PositionRemoveDialog
      position={positionRemoveDialogMock}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )

describe(PositionRemoveDialog.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onConfirm.mockResolvedValue(undefined)
  })

  it('confirms the removal and closes afterwards', async () => {
    renderDialog()

    expect(screen.getByText(/"Caixa" deixa de existir/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('closes without removing when cancelled', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
