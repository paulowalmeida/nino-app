import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CollaboratorRemovalAccess } from './CollaboratorRemovalAccess'

describe(CollaboratorRemovalAccess.name, () => {
  it('opens collaborator removal confirmation', async () => {
    const onOpenRemovalConfirm = vi.fn()
    const user = userEvent.setup()
    render(
      <CollaboratorRemovalAccess
        firstName="Ana"
        onOpenRemovalConfirm={onOpenRemovalConfirm}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Tirar da loja' }))
    expect(onOpenRemovalConfirm).toHaveBeenCalledOnce()
  })

  it('locks removal and explains why', () => {
    render(
      <CollaboratorRemovalAccess
        firstName="Ana"
        removalLockHint="A loja precisa de um dono."
        onOpenRemovalConfirm={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: 'Tirar da loja' })).toBeDisabled()
    expect(screen.getByText('A loja precisa de um dono.')).toBeInTheDocument()
  })
})
