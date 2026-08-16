import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { InviteForm } from '@organisms/InviteForm/InviteForm'

describe(InviteForm.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('invites the typed email as a staff seat by default', async () => {
    // Arrange
    const onInvite = vi.fn().mockResolvedValue(undefined)
    render(<InviteForm onInvite={onInvite} />)

    // Act
    await userEvent.type(
      screen.getByPlaceholderText('nome@exemplo.com'),
      'novo@nino.delivery'
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Enviar convite' })
    )

    // Assert
    expect(onInvite).toHaveBeenCalledWith({
      email: 'novo@nino.delivery',
      kind: 'STAFF',
      role: 'STAFF',
    })
  })

  it('shows a confirmation naming who was invited', async () => {
    // Arrange
    const onInvite = vi.fn().mockResolvedValue(undefined)
    render(<InviteForm onInvite={onInvite} />)
    await userEvent.type(
      screen.getByPlaceholderText('nome@exemplo.com'),
      'convidado@nino.delivery'
    )

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Enviar convite' })
    )

    // Assert
    expect(
      await screen.findByText('Convite enviado para convidado@nino.delivery.')
    ).toBeInTheDocument()
  })

  it('requires an email before sending the invite', async () => {
    // Arrange
    const onInvite = vi.fn()
    render(<InviteForm onInvite={onInvite} />)

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Enviar convite' })
    )

    // Assert
    expect(
      await screen.findByText('Informe o e-mail de quem você quer chamar')
    ).toBeInTheDocument()
    expect(onInvite).not.toHaveBeenCalled()
  })

  it('shows an error and keeps the email when sending fails', async () => {
    // Arrange
    const onInvite = vi.fn().mockRejectedValue(new Error('boom'))
    render(<InviteForm onInvite={onInvite} />)
    await userEvent.type(
      screen.getByPlaceholderText('nome@exemplo.com'),
      'falha@nino.delivery'
    )

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Enviar convite' })
    )

    // Assert
    expect(
      await screen.findByText(
        'Não foi possível enviar o convite. Confira o e-mail.'
      )
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('nome@exemplo.com')).toHaveValue(
      'falha@nino.delivery'
    )
  })
})
