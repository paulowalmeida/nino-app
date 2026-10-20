import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { InviteForm } from './InviteForm'
import { inviteFormMock, inviteFormSeatsMock } from './InviteForm.mock'

describe(InviteForm.name, () => {
  it('presents the invitation fields and submit action', () => {
    render(
      <InviteForm
        onInvite={async () => undefined}
        seats={inviteFormSeatsMock}
      />
    )

    expect(
      screen.getByPlaceholderText('nome@exemplo.com')
    ).toBeInTheDocument()
    expect(screen.getByText('Enviar convite')).toBeInTheDocument()
  })

  it('invites for the lowest cargo by default', async () => {
    const onInvite = vi.fn().mockResolvedValue(undefined)
    render(<InviteForm onInvite={onInvite} seats={inviteFormSeatsMock} />)

    await userEvent.type(
      screen.getByPlaceholderText('nome@exemplo.com'),
      inviteFormMock.email
    )
    await userEvent.click(screen.getByText(inviteFormMock.submitLabel))

    await waitFor(() =>
      expect(onInvite).toHaveBeenCalledWith({
        email: inviteFormMock.email,
        kind: 'STAFF',
        positionId: 'position-staff',
      })
    )
    expect(
      await screen.findByText(`Convite enviado para ${inviteFormMock.email}.`)
    ).toBeInTheDocument()
  })

  it('shows an error when the invitation is refused', async () => {
    const onInvite = vi.fn().mockRejectedValue(new Error('refused'))
    render(<InviteForm onInvite={onInvite} seats={inviteFormSeatsMock} />)

    await userEvent.type(
      screen.getByPlaceholderText('nome@exemplo.com'),
      inviteFormMock.email
    )
    await userEvent.click(screen.getByText(inviteFormMock.submitLabel))

    expect(
      await screen.findByText(/Não foi possível enviar o convite/)
    ).toBeInTheDocument()
  })

  it('invites a courier without a cargo when it is the only seat', async () => {
    const onInvite = vi.fn().mockResolvedValue(undefined)
    render(
      <InviteForm onInvite={onInvite} seats={[inviteFormSeatsMock[2]]} />
    )

    await userEvent.type(
      screen.getByPlaceholderText('nome@exemplo.com'),
      inviteFormMock.email
    )
    await userEvent.click(screen.getByText(inviteFormMock.submitLabel))

    await waitFor(() =>
      expect(onInvite).toHaveBeenCalledWith({
        email: inviteFormMock.email,
        kind: 'COURIER',
      })
    )
  })
})
