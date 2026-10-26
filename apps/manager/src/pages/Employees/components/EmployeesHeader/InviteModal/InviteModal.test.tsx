import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { InviteModal } from './InviteModal'
import { inviteModalMock, inviteModalSeatsMock } from './InviteModal.mock'

const typeEmailAndSend = async () => {
  await userEvent.type(
    screen.getByPlaceholderText('nome@exemplo.com'),
    inviteModalMock.email
  )
  await userEvent.click(
    screen.getByRole('button', { name: inviteModalMock.submitLabel })
  )
}

describe(InviteModal.name, () => {
  it('stays out of the page until it is opened', () => {
    render(
      <InviteModal
        open={false}
        onOpenChange={vi.fn()}
        onInvite={vi.fn()}
        seats={inviteModalSeatsMock}
      />
    )

    expect(
      screen.queryByPlaceholderText('nome@exemplo.com')
    ).not.toBeInTheDocument()
  })

  it('invites for the lowest cargo by default and closes', async () => {
    const onInvite = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()
    render(
      <InviteModal
        open
        onOpenChange={onOpenChange}
        onInvite={onInvite}
        seats={inviteModalSeatsMock}
      />
    )

    await typeEmailAndSend()

    await waitFor(() =>
      expect(onInvite).toHaveBeenCalledWith({
        email: inviteModalMock.email,
        kind: 'STAFF',
        positionId: 'position-staff',
      })
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('stays open with an error when the invitation is refused', async () => {
    const onInvite = vi.fn().mockRejectedValue(new Error('refused'))
    const onOpenChange = vi.fn()
    render(
      <InviteModal
        open
        onOpenChange={onOpenChange}
        onInvite={onInvite}
        seats={inviteModalSeatsMock}
      />
    )

    await typeEmailAndSend()

    expect(
      await screen.findByText(/Não foi possível enviar o convite/)
    ).toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('invites a courier without a cargo when it is the only seat', async () => {
    const onInvite = vi.fn().mockResolvedValue(undefined)
    render(
      <InviteModal
        open
        onOpenChange={vi.fn()}
        onInvite={onInvite}
        seats={[inviteModalSeatsMock[2]]}
      />
    )

    await typeEmailAndSend()

    await waitFor(() =>
      expect(onInvite).toHaveBeenCalledWith({
        email: inviteModalMock.email,
        kind: 'COURIER',
      })
    )
  })

  it('closes without sending from the cancel button', async () => {
    const onInvite = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <InviteModal
        open
        onOpenChange={onOpenChange}
        onInvite={onInvite}
        seats={inviteModalSeatsMock}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onInvite).not.toHaveBeenCalled()
  })
})
