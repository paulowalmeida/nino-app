import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EditEmailModal } from '@compositions/EditEmailModal/EditEmailModal'

const renderModal = (onSave: (email: string) => Promise<unknown>) => {
  const onOpenChange = vi.fn()

  render(
    <EditEmailModal
      open
      onOpenChange={onOpenChange}
      title="Trocar e-mail"
      hint="Usado para avisos da loja."
      currentEmail="loja@exemplo.com"
      onSave={onSave}
    />
  )

  return { onOpenChange }
}

const emailField = () => screen.getByLabelText('E-mail')
const saveButton = () => screen.getByRole('button', { name: 'Salvar e-mail' })

describe(EditEmailModal.name, () => {
  it('starts filled with the current email', () => {
    // Arrange / Act
    renderModal(vi.fn())

    // Assert
    expect(emailField()).toHaveValue('loja@exemplo.com')
  })

  it('keeps saving disabled until the email changes', () => {
    // Arrange / Act
    renderModal(vi.fn())

    // Assert
    expect(saveButton()).toBeDisabled()
  })

  it('saves the new email and closes the modal', async () => {
    // Arrange
    const onSave = vi.fn().mockResolvedValue(undefined)
    const { onOpenChange } = renderModal(onSave)

    // Act
    await userEvent.clear(emailField())
    await userEvent.type(emailField(), 'novo@exemplo.com')
    await userEvent.click(saveButton())

    // Assert
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith('novo@exemplo.com')
    )
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it('shows an error and stays open when saving fails', async () => {
    // Arrange
    const onSave = vi.fn().mockRejectedValue(new Error('boom'))
    const { onOpenChange } = renderModal(onSave)

    // Act
    await userEvent.clear(emailField())
    await userEvent.type(emailField(), 'novo@exemplo.com')
    await userEvent.click(saveButton())

    // Assert
    expect(
      await screen.findByText(/Não foi possível salvar/)
    ).toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
