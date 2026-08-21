import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  CollaboratorAccess,
} from '@organisms/CollaboratorAccess/CollaboratorAccess'
import {
  invitedStaff,
  ownerStaff,
  staffWithLogin,
} from './CollaboratorAccess.mock'

const openRemovalConfirm = vi.fn()
const openEmailModal = vi.fn()

const renderAccess = ({
  member = staffWithLogin,
  roleLockHint,
  removalLockHint,
}: {
  member?: typeof staffWithLogin
  roleLockHint?: string
  removalLockHint?: string
} = {}) =>
  render(
    <CollaboratorAccess
      member={member}
      roleLockHint={roleLockHint}
      isChangingRole={false}
      onChangeRole={vi.fn()}
      removalLockHint={removalLockHint}
      onOpenEmailModal={openEmailModal}
      onOpenRemovalConfirm={openRemovalConfirm}
    />
  )

describe(CollaboratorAccess.name, () => {
  it('offers the three ways to administer this person', () => {
    // Arrange / Act
    renderAccess()

    // Assert
    expect(screen.getByText('Até onde vai nesta loja')).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: /Atendente/ })
    ).toBeChecked()
    expect(
      screen.getByRole('button', { name: 'Editar e-mail' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Tirar da loja' })
    ).toBeInTheDocument()
  })

  it('opens the removal confirmation instead of removing at once', async () => {
    // Arrange
    renderAccess()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Tirar da loja' }))

    // Assert
    expect(openRemovalConfirm).toHaveBeenCalledOnce()
  })

  it('says why the role and the removal are locked', () => {
    // Arrange
    // Act
    renderAccess({
      member: ownerStaff,
      roleLockHint: 'Só o dono da loja muda o cargo de alguém.',
      removalLockHint: 'A loja precisa de um dono — passe o cargo antes.',
    })

    // Assert
    expect(
      screen.getByText('Só o dono da loja muda o cargo de alguém.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tirar da loja' })).toBeDisabled()
  })

  it('warns that a pending invite still has no access', () => {
    // Arrange / Act
    renderAccess({ member: invitedStaff })

    // Assert
    expect(screen.getByText(/Convite ainda não aceito/)).toBeInTheDocument()
    expect(screen.getByText(/A conta está desativada/)).toBeInTheDocument()
  })
})
