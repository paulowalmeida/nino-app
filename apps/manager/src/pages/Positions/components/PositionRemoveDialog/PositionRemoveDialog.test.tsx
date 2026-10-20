import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'

import { PositionRemoveDialog } from './PositionRemoveDialog'
import { positionRemoveDialogMock } from './PositionRemoveDialog.mock'

vi.mock('@pages/Positions/facades/usePositionsFacade/usePositionsFacade')

const removePosition = vi.fn()
const onClose = vi.fn()

describe(PositionRemoveDialog.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    removePosition.mockResolvedValue(undefined)
    vi.mocked(usePositionsFacade).mockReturnValue({ removePosition } as never)
  })

  it('removes the selected cargo and closes after confirming', async () => {
    render(
      <PositionRemoveDialog
        position={positionRemoveDialogMock}
        onClose={onClose}
      />
    )

    expect(screen.getByText(/"Caixa" deixa de existir/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))

    expect(removePosition).toHaveBeenCalledWith('position-cashier')
    await vi.waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('closes without removing when cancelled', async () => {
    render(
      <PositionRemoveDialog
        position={positionRemoveDialogMock}
        onClose={onClose}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(removePosition).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
