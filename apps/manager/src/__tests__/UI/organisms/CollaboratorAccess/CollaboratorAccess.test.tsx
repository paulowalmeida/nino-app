import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TenantRole } from '@custom_types/auth/tenant-role'
import { CollaboratorAccess } from '@organisms/CollaboratorAccess/CollaboratorAccess'
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
  isChangingRole = false,
  onChangeRole = vi.fn(),
}: {
  member?: typeof staffWithLogin
  roleLockHint?: string
  removalLockHint?: string
  isChangingRole?: boolean
  onChangeRole?: (role: TenantRole) => void
} = {}) =>
  render(
    <CollaboratorAccess
      member={member}
      roleLockHint={roleLockHint}
      isChangingRole={isChangingRole}
      onChangeRole={onChangeRole}
      removalLockHint={removalLockHint}
      onOpenEmailModal={openEmailModal}
      onOpenRemovalConfirm={openRemovalConfirm}
    />
  )

describe(CollaboratorAccess.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('offers the three ways to administer this person', () => {
    // Arrange / Act
    renderAccess()

    // Assert
    expect(screen.getByText('Até onde vai nesta loja')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Atendente/ })).toBeChecked()
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

  it('opens the email editor', async () => {
    // Arrange
    const user = userEvent.setup()
    renderAccess()

    // Act
    await user.click(screen.getByRole('button', { name: 'Editar e-mail' }))

    // Assert
    expect(openEmailModal).toHaveBeenCalledOnce()
  })

  it('requests the selected role change', async () => {
    // Arrange
    const user = userEvent.setup()
    const onChangeRole = vi.fn()
    renderAccess({ onChangeRole })

    // Act
    await user.click(screen.getByRole('radio', { name: /Gerente/ }))

    // Assert
    expect(onChangeRole).toHaveBeenCalledWith('MANAGER')
  })

  it('disables role choices while a role change is in progress', () => {
    // Arrange / Act
    renderAccess({ isChangingRole: true })

    // Assert
    expect(screen.getByRole('radio', { name: /Gerente/ })).toBeDisabled()
  })

  it('says why the role and the removal are locked', () => {
    // Arrange / Act
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
