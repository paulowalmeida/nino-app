import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { RemoveUnitModal } from '@compositions/RemoveUnitModal/RemoveUnitModal'
import type { RemoveUnitModalProps } from '@compositions/RemoveUnitModal/RemoveUnitModal'

const renderModal = (props: Partial<RemoveUnitModalProps> = {}) =>
  render(
    <RemoveUnitModal
      open
      onOpenChange={vi.fn()}
      unitName="Loja Centro"
      onConfirm={vi.fn()}
      {...props}
    />
  )

describe(RemoveUnitModal.name, () => {
  it('keeps the confirm button disabled until the typed name matches', async () => {
    // Arrange
    const user = userEvent.setup()
    renderModal()
    const confirmButton = screen.getByRole('button', { name: 'Confirmar' })

    // Act
    await user.type(screen.getByLabelText(/Para confirmar/), 'Loja')

    // Assert
    expect(confirmButton).toBeDisabled()
  })

  it('enables the confirm button once the typed name matches exactly', async () => {
    // Arrange
    const user = userEvent.setup()
    renderModal()

    // Act
    await user.type(screen.getByLabelText(/Para confirmar/), 'Loja Centro')

    // Assert
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeEnabled()
  })

  it('calls onConfirm on submit once the name matches', async () => {
    // Arrange
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    renderModal({ onConfirm })
    await user.type(screen.getByLabelText(/Para confirmar/), 'Loja Centro')

    // Act
    await user.click(screen.getByRole('button', { name: 'Confirmar' }))

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('resets the typed name after closing and reopening', () => {
    // Arrange
    const { rerender } = renderModal({ open: true })

    // Act
    rerender(
      <RemoveUnitModal
        open={false}
        onOpenChange={vi.fn()}
        unitName="Loja Centro"
        onConfirm={vi.fn()}
      />
    )
    rerender(
      <RemoveUnitModal
        open
        onOpenChange={vi.fn()}
        unitName="Loja Centro"
        onConfirm={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByLabelText(/Para confirmar/)).toHaveValue('')
  })

  it('calls onOpenChange with false when cancel is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderModal({ onOpenChange })

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
